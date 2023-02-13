# LTS
FROM node:18.14-alpine

RUN apk add --no-cache --virtual .build-deps curl bash \
        && npm install -g pnpm

# ユーザ作とユーザディレクトリ
ARG USER_NAME="user"
RUN echo 'root:root' |chpasswd
RUN adduser -S ${USER_NAME} \
    && echo "${USER_NAME} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers \
    && echo "${USER_NAME}:${USER_NAME}" | chpasswd
USER $USER_NAME

WORKDIR /home/$USER_NAME

# アプリケーションの依存関係をインストールする

COPY --chown=user ../dist/ ./dist/
COPY --chown=user ../lib/ .
COPY --chown=user ../server/index.mjs .
COPY --chown=user ../server/package.json .

RUN pnpm install && pnpm link ./local-util

EXPOSE 9999

CMD [ "node", "index.mjs", "./dist" ]
