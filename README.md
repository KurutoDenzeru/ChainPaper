# ChainPaper

> Trustless whitepaper collaboration tool with authorship proofs, no backend required.

## Overview

ChainPaper is a decentralized application for collaborative document editing with built-in authorship verification. It allows multiple users to work on whitepapers together while maintaining a verifiable history of contributions using cryptographic proofs.

## Features

- **Rich Text Editing**: Powered by TipTap editor for a seamless writing experience
- **Real-time Collaboration**: Using Yjs and WebRTC for peer-to-peer synchronization
- **Authorship Verification**: SHA-256 hashing and Merkle Tree implementation for proof of contribution
- **Offline Support**: Local storage with IndexedDB persistence
- **No Backend Required**: Fully client-side application with optional IPFS/Arweave publishing
- **Document Export**: Save and share documents with complete authorship history

## Tech Stack

- **Frontend Framework**: Nuxt.js (Vue 3)
- **Editor**: TipTap with Yjs collaboration
- **Styling**: Tailwind CSS
- **Authorship Verification**: SHA-256 via Web Crypto API + custom Merkle Tree implementation
- **Data Storage**: localStorage, IndexedDB
- **Collaboration**: Yjs, WebRTC

## Getting Started

### Prerequisites

- Node.js (v20 or later)
- bun or pnpm

The application will be available at http://localhost:3000

## How It Works

### Document Editing

ChainPaper uses TipTap, a headless editor framework based on ProseMirror, to provide a rich text editing experience. The editor supports common formatting options and is extensible for additional features.

### Collaboration

Real-time collaboration is powered by Yjs, a CRDT (Conflict-free Replicated Data Type) implementation that enables seamless synchronization between peers. WebRTC is used for peer-to-peer communication, allowing users to collaborate without a central server.

### Authorship Verification

Every edit is hashed using SHA-256 and added to a Merkle Tree, creating a verifiable chain of contributions. This allows users to prove authorship of specific content and verify the integrity of the document history.

### Storage

Documents are stored locally using browser storage mechanisms (localStorage and IndexedDB). Users can export documents as JSON files, which include the content, metadata, and cryptographic proofs.
