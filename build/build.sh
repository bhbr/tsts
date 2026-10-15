#!/bin/bash
if [ -d "../dist" ]; then
	rm -r ../dist/*
fi
tsc --build tsconfig.json
