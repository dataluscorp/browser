#!/bin/bash
while IFS= read -r line; do
    `mv $line ${line/firefox/datalus}`
done < rename_files.txt