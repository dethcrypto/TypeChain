FROM node:9.10.1-alpine as builder
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh alpine-sdk python python-dev py-pip build-base
RUN mkdir -p /src/
WORKDIR /src/
RUN npm install -g yarn
ADD package.json yarn.lock /src/
RUN yarn install --frozen-lockfile --ignore-scripts
ADD . .
RUN yarn build

FROM node:9.10.1-alpine
RUN mkdir -p /app
ADD ./runtime/ /app/runtime/
ADD package.json /app/package.json
COPY --from=builder /src/dist /app/bin/
COPY --from=builder /src/node_modules/ /app/bin/node_modules/
RUN mkdir -p /abi
WORKDIR /abi
CMD ["/app/bin/cli.js"]



