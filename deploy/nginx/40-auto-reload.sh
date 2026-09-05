#!/bin/sh
# Automatically reload Nginx daily at 00:00 to pick up renewed Let's Encrypt SSL certificates
echo "0 0 * * * nginx -s reload" | crontab -
crond -b -l 2
