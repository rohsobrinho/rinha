FROM node:18 as base
WORKDIR /usr/src/app

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json yarn.lock index.ts /temp/dev/
RUN cd /temp/dev && yarn install --frozen-lockfile

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=install /temp/dev/node_modules node_modules
COPY . .

ENV NODE_ENV=production

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY --from=install /temp/dev/index.ts .
COPY --from=prerelease /usr/src/app/package.json .
COPY --from=prerelease /usr/src/app/prisma prisma

EXPOSE 3000