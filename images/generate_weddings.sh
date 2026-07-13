#!/bin/bash

for img in 3J0A*.JPG 3J0A*.jpg; do
    if [ -f "$img" ]; then
        {
            echo "    <div class=\"portfolio-item filter-weddings\">"
            echo "        <img src=\"images/$img\" alt=\"Coast Photographic Wedding Masterpiece\">"
            echo "        <div class=\"item-overlay\">"
            echo "            <h3>Wedding Capture</h3>"
            echo "        </div>"
            echo "    </div>"
            echo ""
        } >> wedding_code.txt
    fi
done

echo "[+] Successfully appended the new wedding photos to wedding_code.txt!"
