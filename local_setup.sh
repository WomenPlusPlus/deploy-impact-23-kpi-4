#!/bin/bash

echo "Moving to frontend directory..."
cd frontend

echo "Installing React dependencies..."
npm install

echo "Run build directory..."
npm run build

echo "Navigating to main directory..."
cd ..

echo "Copying build directory to backend..."
cp -r frontend/build backend/
