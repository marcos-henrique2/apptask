import { useState, useEffect } from 'react'
import './admin.css'
import {auth, db} from '../../firebaseConnection'
import { signOut } from 'firebase/auth'
import {addDoc, collection, onSnapshot, query, orderBy, where, doc, deleteDoc, updateDoc} from 'firebase/firestore'

export default function Admin(){

    const [tarefa, setTarefa] = useState('');
    const [user, setUser] = useState({});
    const [task, setTask] = useState([]);
    const [edit, setEdit] = useState({})

    useEffect(() => {
        async function loadTarefas(){
            const userDetail = localStorage.getItem("@detailUser")
            setUser(JSON.parse(userDetail))

            if(userDetail){
                const data = JSON.parse(userDetail);

                const tarefaRef = collection(db, "tarefas")
                const q = query(tarefaRef, orderBy("created", "desc"), where("userUid", "==", data?.uid))

                const unsub = onSnapshot(q, (snapshot) => {
                    let lista = [];

                    snapshot.forEach((doc) => {
                        lista.push({
                          id: doc.id,
                          tarefa: doc.data().tarefa,
                          userUid: doc.data().userUid
                        })
                    })
                    
                    setTask(lista)

                })
            }

        }

        loadTarefas();
    }, [])

    async function handleRegister(e){
        e.preventDefault();

        if(tarefa === ''){
            alert("Digite uma tarefa...")
            return;
        }
        
        if(edit?.id){
            handleUpdateTarefa();
            return;
        }

        await addDoc(collection(db, "tarefas"), {
            tarefa: tarefa,
            created: new Date(),
            userUid: user?.uid
        })
        .then(() => {
            console.log("Tarefa registrada")
            setTarefa('')
        })
        .catch((error) => {
            console.log("Erro ao registrar" + error)
        })

    }

    async function handleLogout(){
        await signOut(auth);
    }

    async function deleteTerefa(id){
        const docRef = doc(db, "tarefas", id)
        await deleteDoc(docRef)
    }

    function editTarefa(item){
        setTarefa(item.tarefa);
        setEdit(item);
    }

    async function  handleUpdateTarefa(){
        const docRef = doc(db, "tarefas", edit?.id)
        await updateDoc(docRef, {
            tarefa: tarefa
        })
        .then(() => {
            setTarefa('')
            setEdit({})
        })
        .catch(() => {
            setTarefa('')
            setEdit('')
        })
    }

    return(
        <div className='admin-container' >
            <h1>Minhas tarefas</h1>

            <form className='form' onSubmit={handleRegister} >
                <textarea
                    placeholder='Digite sua tarefa...'
                    value={tarefa}
                    onChange={(e) => setTarefa(e.target.value) }
                />

                {Object.keys(edit).length > 0 ? (
                    <button className='btn-register' type='submit' style={{backgroundColor: '#6add39'}} >Atuliazar tarefa</button>
                ): (
                    <button className='btn-register' type='submit' >Registrar tarefa</button>
                )}
            </form>

            {task.map((item) => (
                <article  key={item.id} className='list' >
                    <p> {item.tarefa} </p>

                    <div>
                        <button onClick={() => editTarefa(item) } >Editar</button>
                        <button  onClick={() => deleteTerefa(item.id) } className='btn-delete' >Concluir</button>
                    </div>
                </article>
            ))}

            <button className='btn-logout' onClick={handleLogout} >Sair</button>


        </div>
    )
}