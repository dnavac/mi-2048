# 2048
A small clone of [1024](https://play.google.com/store/apps/details?id=com.veewo.a1024), based on [Saming's 2048](http://saming.fr/p/2048/) (also a clone). 2048 was indirectly inspired by [Threes](https://asherv.com/threes/).

## Cómo ejecutar

1.  Instala las dependencias:
    ```bash
    npm install
    ```

2.  Configura las variables de entorno:
    - Copia el archivo de ejemplo:
      ```bash
      cp .env.example .env
      ```
    - Edita `.env` y agrega tu `APP_ID` de Worldcoin (necesario para la verificación).

3.  Inicia el servidor:
    ```bash
    npm start
    ```

4.  Abre [http://localhost:8080](http://localhost:8080) en tu navegador.