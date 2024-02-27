RUN yarn prisma generate
RUN yarn prisma push db

EXPOSE 3000