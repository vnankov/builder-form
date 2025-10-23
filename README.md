# 🧩 Project Setup Guide

## 📦 1. Install Dependencies

This project has both **root-level** and **client/server** dependencies.

First, install the packages in the **root** directory (important because of the `concurrently` dependency):

```bash
npm install


Then, install dependencies in each subproject:
cd client
npm install

cd ../server
npm install


Once all dependencies are installed, start both the client and server together (from root directory):
npm run dev

Run all clients tests with (checkout client folder):
npm run test