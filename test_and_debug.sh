#!/bin/bash

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Check if Visual Studio Code is installed
if ! command -v code &> /dev/null; then
    echo "Visual Studio Code is not installed. Please install Visual Studio Code and try again."
    exit 1
fi


# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Run tests
echo "Running tests..."
npm test

# Open the extension in Visual Studio Code for debugging
echo "Opening the extension in Visual Studio Code..."
code .
