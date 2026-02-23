import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

const DATA_ROOT = path.join(process.cwd(), ".eduvault");
const BLOBS_DIR = path.join(DATA_ROOT, "blobs");
const META_INDEX_PATH = path.join(DATA_ROOT, "metadata-index.json");

interface MetaIndex {
  [uri: string]: unknown;
}

async function ensureStore() {
  await mkdir(BLOBS_DIR, { recursive: true });
}

async function readMetaIndex(): Promise<MetaIndex> {
  try {
    const raw = await readFile(META_INDEX_PATH, "utf8");
    return JSON.parse(raw) as MetaIndex;
  } catch {
    return {};
  }
}

async function writeMetaIndex(index: MetaIndex) {
  await ensureStore();
  await writeFile(META_INDEX_PATH, JSON.stringify(index, null, 2), "utf8");
}

export async function storeLocalBlob(buffer: Buffer, extension = "bin") {
  await ensureStore();
  const ref = `mock-${randomUUID()}`;
  const filePath = path.join(BLOBS_DIR, `${ref}.${extension.replace(/^\./, "")}`);
  await writeFile(filePath, buffer);
  return {
    ref,
    uri: `0g://${ref}`,
    filePath,
  };
}

export async function readLocalBlob(ref: string) {
  await ensureStore();
  const entries = [
    path.join(BLOBS_DIR, `${ref}.bin`),
    path.join(BLOBS_DIR, `${ref}.txt`),
    path.join(BLOBS_DIR, `${ref}.json`),
    path.join(BLOBS_DIR, `${ref}.prompt`),
  ];

  for (const filePath of entries) {
    try {
      const data = await readFile(filePath);
      return { data, filePath };
    } catch {
      // continue trying paths
    }
  }

  throw new Error(`Local blob not found for ref ${ref}`);
}

export async function rememberMetadata(uri: string, metadata: unknown) {
  const current = await readMetaIndex();
  current[uri] = metadata;
  await writeMetaIndex(current);
}

export async function readRememberedMetadata<T>(uri: string): Promise<T | null> {
  const current = await readMetaIndex();
  const value = current[uri];
  return (value ?? null) as T | null;
}
