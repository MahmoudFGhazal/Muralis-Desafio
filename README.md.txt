Instruções de Uso:

##Frontend

1. Inicie o index.html.
2. Verificar a conecção entre o frontend e o backend.
3. Testar Funcionalidades.

##Backend

1. Certifique-se de que o MySQL esteja em execução.
2. Instale as dependências.
3. Configure o arquivo application.properties, se houver necessidade.
3. Incie a Application.java.

##Banco de Dados

1. Instale o MySQL em seu sistema.
2. Configure o user e a senha para root e 1234, respectivamente.
3. Crie o banco com o arquivo createDatabase.txt.
4. Popule o Banco com o arquivo inserts.txt.





Estrutura:

|
|-db
|
|-src
| |-assets
| |-pages
| |-scripts
| |-styles
| |-index.html
|
|-services
| |-src
| | |-main
| | | |-java
| | | | |-com
| | | | | |-muralis
| | | | | | |-Application.java
| | | |-resource
| | | | |-application.properties
| |-pom
|
|-README.md

##Backend
- **services/src/main/java/com/muralis**: Principal Estrtura do Backend/API.
- **services/src/main/java/com/muralis/Application.java**: Principal arquivo para a execução da API.
- **services/src/main/resource/application.properties**: Configurações basica da API.
- **services/pom**: Arquivo de configuração do Maven,  onde as dependências do projeto são gerenciadas.

##Frontend
- **src/index.html**: Página principal do frontend.
- **src/styles**: Arquivos SCSS que vão ser usados em diferentes lugares do projeto.
- **src/assets**: Contém todas as imagens utilizadas no projeto.
- **src/pages**: Páginas do site divididas em arquivos para cada uma com os recursos utilizadas em cada uma.
- **src/sripts**: Arquivos javascript que vão ser usados em diferentes lugares do projeto.

##Banco de Dados
- **db/createDatabase**: Script para criar o banco de dados.
- **db/inserts**: Script para popular o banco de dados.





Dependêcias:

- **HTML**: Estrutura da interface do usuário.
- **CSS**: Estilização da interface do usuário.
- **JavaScript**: Funcionalidade interativa da interface do usuário.
- **Spring Boot**: Framework Java para o backend.
- **MySQL**: Banco de dados relacional.
- **Lombok**: Biblioteca Java para reduzir o código boilerplate, como getters, setters e construtores.
- **JPA (Java Persistence API)**: Para interação com o banco de dados.
- **SCSS**: Pré-processador CSS para estilização.

1. **Java 17**: Linguagem de Programação.
2. **HTML, CSS e JavaScript**: Para a criação da interface do usuário.
3. **Spring Boot**: Para o backend.
4. **Lombok**: Para reduzir código boilerplate.
5. **JPA**: Para persistência de dados.
6. **Maven**: Para gerenciamento de dependências e construção do projeto.
7. **MySQL**: Banco de dados.