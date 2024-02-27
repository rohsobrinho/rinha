FROM node:18

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy app dependency files
COPY package.json yarn.lock /tmp/

# Install packages and link to tmp file
RUN cd /tmp && yarn
COPY . .

COPY /tmp/node_modules node_modules

EXPOSE 3000

CMD ["yarn", "prisma:generate"]
CMD ["yarn", "prisma:seed"]
ENTRYPOINT [ "yarn", "start" ]