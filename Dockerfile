FROM denoland/deno

EXPOSE 8000

WORKDIR /app

ADD . /app

RUN deno cache index.ts

CMD ["run", "--allow-all", "--unstable", "index.ts"]