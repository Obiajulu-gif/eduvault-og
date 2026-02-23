// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract EduVaultMarketplace is ReentrancyGuard {
    struct Prompt {
        address seller;
        uint256 priceWei;
        string metadataURI;
        bool isActive;
    }

    uint256 private _nextPromptId;

    mapping(uint256 => Prompt) private _prompts;
    mapping(address => uint256) private _proceeds;
    mapping(uint256 => mapping(address => bool)) private _licenses;

    event PromptListed(uint256 indexed promptId, address indexed seller, uint256 priceWei, string metadataURI);
    event PromptPurchased(uint256 indexed promptId, address indexed buyer, uint256 priceWei);
    event Withdrawn(address indexed seller, uint256 amount);

    constructor() {
        _nextPromptId = 1;
    }

    function listPrompt(string calldata metadataURI, uint256 priceWei) external returns (uint256 promptId) {
        require(priceWei > 0, "Price must be > 0");
        require(bytes(metadataURI).length > 0, "Metadata URI required");

        promptId = _nextPromptId++;
        _prompts[promptId] = Prompt({
            seller: msg.sender,
            priceWei: priceWei,
            metadataURI: metadataURI,
            isActive: true
        });

        emit PromptListed(promptId, msg.sender, priceWei, metadataURI);
    }

    function buyPrompt(uint256 promptId) external payable nonReentrant {
        Prompt storage prompt = _prompts[promptId];

        require(prompt.seller != address(0), "Prompt does not exist");
        require(prompt.isActive, "Prompt inactive");
        require(msg.sender != prompt.seller, "Cannot buy own prompt");
        require(msg.value >= prompt.priceWei, "Insufficient payment");

        _licenses[promptId][msg.sender] = true;
        _proceeds[prompt.seller] += msg.value;

        emit PromptPurchased(promptId, msg.sender, msg.value);
    }

    function withdrawProceeds() external nonReentrant {
        uint256 amount = _proceeds[msg.sender];
        require(amount > 0, "No proceeds");

        _proceeds[msg.sender] = 0;

        (bool ok, ) = payable(msg.sender).call{value: amount}("");
        require(ok, "Transfer failed");

        emit Withdrawn(msg.sender, amount);
    }

    function getPrompt(uint256 promptId)
        external
        view
        returns (address seller, uint256 priceWei, string memory metadataURI, bool isActive)
    {
        Prompt memory prompt = _prompts[promptId];
        return (prompt.seller, prompt.priceWei, prompt.metadataURI, prompt.isActive);
    }

    function hasLicense(uint256 promptId, address user) external view returns (bool) {
        return _licenses[promptId][user];
    }

    function proceedsOf(address seller) external view returns (uint256) {
        return _proceeds[seller];
    }
}
