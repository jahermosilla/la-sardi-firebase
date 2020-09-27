cd ../client
npm run build

cd ../server
mkdir public 2> /dev/null
rm -rf public/*
mv ../client/dist/* ./public

firebase deploy --only hosting