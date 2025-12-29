FROM node:22.17-alpine

WORKDIR /app

COPY package*.json ./
COPY ./prisma ./prisma
RUN npm install
ENV DATABASE_URL="postgresql://postgres:1234@postgres:5432/libraries-2?schema=public"
COPY *.js ./
COPY *.mjs ./
COPY *.json ./
COPY *.ts ./
COPY ./src ./src
RUN npx prisma generate

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate dev --name libraries-2 && npm run start:dev -L"]
