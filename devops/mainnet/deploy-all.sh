aws s3 cp ../../s3/index.html s3://kstable.io/
aws s3 cp ../../s3/error.html s3://kstable.io/
aws s3 cp ../../s3/favicon.ico s3://kstable.io/
./sync-home-test.sh
./sync-pool1-test.sh
# ./sync-pool2-test.sh
# ./sync-pool3-test.sh
./sync-stake1-test.sh
# ./sync-stake2-test.sh
# ./sync-stake3-test.sh
./sync-payment-test.sh
