FROM node:9.10.1-alpine as builder
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
RUN npm install -g yarn
ADD package.json .
RUN npm install
ADD . .
RUN npm run-script build

FROM node:9.10.1-alpine
RUN mkdir -p /app
ADD ./runtime/ /app/runtime/
ADD package.json /app/package.json
COPY --from=builder /dist /app/bin/
COPY --from=builder /node_modules/ /app/bin/node_modules/
RUN mkdir -p /abi
WORKDIR /abi
CMD ["/app/bin/cli.js"]


