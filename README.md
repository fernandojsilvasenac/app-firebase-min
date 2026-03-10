"# app-firebase-min" 
# no App.tsx
import { auth, db} from "./src/lib/firebase";

# 3 blocos  do setup Firebase
Sequencia
1. cria o app
2. cria o auth
3. cria o db

Bloco1
initializeApp(firebaseConfig), cria a "instância principal" do Firebase para esse projeto (como se fosse "ligar o Firebase")

getApps().length ? getApp() : ... é uma proteção:
* Em dev (Hot Reload), o arquivo pode ser reexecutado.
* Se voce tentar getApps().length ? getApp() duas vezes, dá erro.
* Então
- - se já existe o app -> getApp() reaproveita
- - se não existe -> initializeApp(...) cria

app é como a "chave/credencial e a conexão com o projeto Firebase. Tudo (Auth, Firestore, Storage...)

Bloco2
No React Native, pra sessao do usuário "ficar logada", você precisa dizer ao Firebase onde guardar isso (não existe localStorage)
- Então você tenta:
- - initializeAuth(app, { persistence: ...}) -> cria o Auth com persistência em AsyncStorage.
Mas em Hot Reload, o Auth pode já estar iniciado, e initializeAuth pode lançar erro.
Aí o catch devolve getAuth(app) -> pega a instância já existente e segue a vida

Bloco3
Pega o serviço Firestore daquele app (daquele projeto Firebase)
É rápido basicamente "cria o cliente" para você usar o collection, addDoc {json}, etc.
db é o "módulo de banco de dados"