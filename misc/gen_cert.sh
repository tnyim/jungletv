# Generate the root key
openssl genrsa -des3 -out myCA.key 2048

# Generate a root-certificate based on the root-key
openssl req -x509 -new -nodes -key myCA.key -sha256 -days 1825 -out myCA.pem

# Generate a new private key
openssl genrsa -out localhost.key 2048

# Generate a Certificate Signing Request (CSR) based on that private key
openssl req -new -key localhost.key -out localhost.csr

# Create a configuration-file
echo \
"authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = localhost
"> localhost.conf

# Create the certificate for the webserver to serve
openssl x509 -req -in localhost.csr -CA myCA.pem -CAkey myCA.key -CAcreateserial \
-out localhost.crt -days 1825 -sha256 -extfile localhost.conf