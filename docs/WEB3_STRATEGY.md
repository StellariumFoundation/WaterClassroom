# Water Classroom – Web3 & Blockchain Strategy  
_File: docs/WEB3_STRATEGY.md_  
_Version 1.0 · June 2025_

---

## 1 · Vision: Decentralised Learning & Learner Data Ownership  
Water Classroom will evolve into a **self-sovereign learning universe** where:

* Learners own their academic records in a non-custodial wallet.
* Credentials, skills, assets and in-world creations are provably theirs—portable across platforms.
* Value flows transparently: time spent learning, teaching or building content earns on-chain rewards.

Outcome → an open, permissionless knowledge economy that aligns incentives for students, educators and creators.

---

## 2 · Blockchain Credential System Architecture  

| Layer | Tech Choice | Rationale |
|-------|-------------|-----------|
| L1  | **Polygon PoS** | Low fees, EVM compatible, robust ecosystem |
| SSI Spec | **W3C Verifiable Credentials (VC 1.1)** | Global standard, JSON-LD, DID method agnostic |
| Diploma Format | **Blockcerts & OpenCerts inter-op** | Widely recognised open standards |
| Storage | On-chain hash + metadata URI (IPFS / Arweave) | Immutability; large docs off-chain |
| Wallet | WC-Passport (Web, mobile) | Stores VC JWT, NFTs, WC tokens |

Credential mint flow:

```
Assessment-svc → emits Pass event
⇣
Oracle-svc signs payload  ➜  Solidity CredentialMinter.mintSBT(addr, hash, uri)
⇣
Soul-bound NFT minted (tokenId = credential hash) + VC JSON posted to IPFS
⇣
Learner wallet receives event; UI → “Share Cert” (Blockcerts verifier link)
```

---

## 3 · Smart Contracts for Education  

| Contract | Purpose | Key Functions |
|----------|---------|---------------|
| `CredentialMinter.sol` (SBT) | Mint, revoke academic SBTs | `mintSBT`, `revoke`, `verify(hash)` |
| `AssessmentProof.sol` | Store zk-SNARK proof of exam integrity | `submitProof`, `isValid(txId)` |
| `CreatorRoyalty.sol` (ERC-2981) | Route secondary-sale royalties | `setRoyalty(tokenId, pct)`, `royaltyInfo` |
| `Marketplace.sol` | Buy/sell quests, 3-D assets | `listItem`, `buyItem`, `distributeFee` |
| `WCToken.sol` | Utility & rewards (ERC-20) | `stakeLearn`, `claimXP`, `governanceVote` |

Security: audited by CertiK; upgradable via OpenZeppelin UUPS proxies.

---

## 4 · Tokenomics – WC Utility Token  

| Metric | Value |
|--------|-------|
| Symbol | **WC** |
| Supply | Hard-cap 1 B |
| Emissions | 30 % learn-to-earn, 20 % creator rewards, 20 % ecosystem fund, 15 % treasury staking, 10 % team (4-yr vest), 5 % public sale |
| Utility | Pay credential gas, purchase assets, DAO voting, tournament entry |
| Sink Mechanisms | Credential mint fee (burn 25 %), metaverse land rent, avatar skin upgrades |

Staking pools: learners lock WC for boosted XP; creators stake to increase listing visibility.

DAO Governance: token-weighted quadratic voting on curriculum grants & roadmap features.

---

## 5 · NFT-Based Achievement & Skill Graph  

* **SkillNode NFT** – ERC-1155 semi-fungible token per micro-skill; metadata defines Bloom level.  
* **QuestNFT** – ERC-721, soul-bound until quest complete → tradable cosmetic after.  
* **Graph Indexer** – Subgraph on The Graph; queries learner->skill edges for adaptive engine.

Visual Skill Tree rendered in FE; wallet signs to expose read-only view to employers.

---

## 6 · Creator Marketplace & Revenue Sharing  

Revenue split per sale:

| Portion | % |
|---------|---|
| Asset creator royalty (ERC-2981) | 70 |
| Platform fee | 20 |
| Community treasury | 5 |
| Burn (deflation) | 5 |

Marketplace supports fixed-price, Dutch auction, and bundle listings. Payments in WC (discount) or USDC.

---

## 7 · Interoperability Strategy  

* **Blockcerts** – Credential JSON complies with `blockcerts_v3`; universal verifier link embedded.  
* **OpenCerts** – Hash anchored to Ethereum, mirrored via cross-chain relay.  
* **LTI 1.3** – Credentials shareable back into traditional LMS gradebooks.  
* DID methods: `did:polygon`, future `did:key` fallback for walletless access.

---

## 8 · Privacy & Data Sovereignty  

* Personal data stored off-chain, encrypted (AES-256) under learner’s DID-controlled key.  
* Zero-knowledge proof (zk-SNARK) reveals pass/fail without exposing answers.  
* Right-to-be-forgotten -> burn credential + tombstone hash retains integrity without PII.  
* Regional data residency supported via multi-cluster IPFS pinning.

---

## 9 · Regulatory Compliance Checklist  

| Domain | Framework | Mitigation |
|--------|-----------|------------|
| Securities | Howey/FinMA tests | WC = utility token; no profit expectation, consumptive use; legal memo & SAFT for sales |
| Education | FERPA (US), GDPR (EU) | VC data minimal, parental consent flow, EU nodes |
| KYC / AML | FATF VASP guidance | On-ramp via regulated partner; <$50 flow exempt |
| Data Protection | GDPR Art. 17, 20 | Export & delete via wallet burn + key revocation |
| NFT / Gaming | Loot-box regs | Transparent drop rates; no chance-based monetisation |

Continuous legal counsel via Hogan Lovells.

---

## 10 · Implementation Roadmap (Web3 Features)  

| Q | Deliverable | Details |
|---|-------------|---------|
| **Q3-25** | **Credential MVP** | Polygon testnet, SBT mint for pilot assessments |
| **Q4-25** | Wallet Integration | WC-Passport web/mobile; share VC QR codes |
| **Q1-26** | Utility Token Launch | WC token TGE, staking & learn-to-earn live |
| **Q2-26** | Marketplace Beta | CreatorRoyalty + asset listings, 2D items |
| **Q3-26** | zk-Assessment Proofs | ZK circuit, AssessmentProof.sol on mainnet |
| **Q4-26** | DAO Phase 1 | Treasury proposals, quadratic voting |
| **2027** | Cross-chain Inter-Op | Layer-Zero bridge: Polygon ↔ BSC ↔ Ethereum |
| **2028** | Full Decentralisation | Front-end on IPFS, ENS domain, unstoppable infra |

---

### Conclusion  
Water Classroom’s Web3 strategy establishes **trust, ownership and economic alignment** at the core of learning. By fusing verifiable blockchain credentials, equitable tokenomics and a thriving creator marketplace, the platform will pioneer a **decentralised education paradigm** that is secure, compliant and irresistibly engaging.  
