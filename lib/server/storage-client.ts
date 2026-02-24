import { randomUUID } from "node:crypto";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { Indexer, ZgFile } from "@0glabs/0g-ts-sdk";
import { ethers } from "ethers";
import { getNormalizedStoragePrivateKey, getServerEnv, isMockMode } from "@/lib/env";
import { readLocalBlob, readRememberedMetadata, rememberMetadata, storeLocalBlob } from "@/lib/server/local-store";

interface UploadResult {
  ref: string;
  uri: string;
  txHash?: string;
  storage: "0g" | "mock";
}

type IndexerSigner = Parameters<Indexer["upload"]>[2];

function normalizeRef(ref: string) {
  return ref.replace(/^0g:\/\//, "").trim();
}

async function createTempFile(buffer: Buffer, fileName: string) {
  const tmpDir = path.join(os.tmpdir(), "eduvault-storage");
  await mkdir(tmpDir, { recursive: true });
  const filePath = path.join(tmpDir, `${Date.now()}-${randomUUID()}-${fileName}`);
  await writeFile(filePath, buffer);
  return filePath;
}

export async function uploadBufferToStorage(buffer: Buffer, fileName: string): Promise<UploadResult> {
  const env = getServerEnv();
  const privateKey = getNormalizedStoragePrivateKey();
  const extension = path.extname(fileName).replace(/^\./, "") || "bin";

  if (isMockMode() || !privateKey) {
    if (!isMockMode()) {
      console.warn("[Storage] Invalid or missing OG_STORAGE_PRIVATE_KEY, using local mock storage fallback.");
    }
    const local = await storeLocalBlob(buffer, extension);
    return { ref: local.ref, uri: local.uri, storage: "mock" };
  }

  const filePath = await createTempFile(buffer, fileName);
  const provider = new ethers.JsonRpcProvider(env.OG_STORAGE_RPC_URL);
  const signer = new ethers.Wallet(privateKey, provider) as unknown as IndexerSigner;
  const indexer = new Indexer(env.OG_STORAGE_INDEXER_RPC);

  try {
    const zgFile = await ZgFile.fromFilePath(filePath);
    const [, treeErr] = await zgFile.merkleTree();
    if (treeErr) {
      throw new Error(`Merkle tree creation failed: ${treeErr}`);
    }

    const [tx, uploadErr] = await indexer.upload(zgFile, env.OG_STORAGE_RPC_URL, signer);
    await zgFile.close();

    if (uploadErr) {
      throw new Error(`0G upload failed: ${uploadErr}`);
    }

    return {
      ref: tx.rootHash,
      uri: `0g://${tx.rootHash}`,
      txHash: tx.txHash,
      storage: "0g",
    };
  } finally {
    await rm(filePath, { force: true });
  }
}

export async function uploadJsonToStorage(payload: unknown, fileName = "metadata.json") {
  const buffer = Buffer.from(JSON.stringify(payload, null, 2), "utf8");
  const uploaded = await uploadBufferToStorage(buffer, fileName);
  await rememberMetadata(uploaded.uri, payload);
  return uploaded;
}

export async function downloadFromStorage(refOrUri: string) {
  const ref = normalizeRef(refOrUri);
  if (!ref) throw new Error("Missing storage reference");

  if (ref.startsWith("mock-")) {
    return readLocalBlob(ref);
  }

  const env = getServerEnv();
  const indexer = new Indexer(env.OG_STORAGE_INDEXER_RPC);

  const tmpDir = path.join(os.tmpdir(), "eduvault-storage-download");
  await mkdir(tmpDir, { recursive: true });
  const outPath = path.join(tmpDir, `${ref}-${Date.now()}`);

  const err = await indexer.download(ref, outPath, true);
  if (err) throw new Error(`0G download failed: ${err}`);

  const data = await readFile(outPath);
  await rm(outPath, { force: true });

  return { data, filePath: outPath };
}

export async function resolveMetadataFromUri<T>(uri: string): Promise<T | null> {
  if (!uri) return null;

  const remembered = await readRememberedMetadata<T>(uri);
  if (remembered) return remembered;

  try {
    const downloaded = await downloadFromStorage(uri);
    const json = JSON.parse(downloaded.data.toString("utf8")) as T;
    await rememberMetadata(uri, json);
    return json;
  } catch {
    return null;
  }
}
