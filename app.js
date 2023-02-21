require('colors');

const { inquirerMenu,
        pause,
        leerInput,
        listadoTareasBorrar,
        confirm,
        mostrarListadoCheckList
} = require('./helpers/inquirer');

const { saveDB, readDB } = require('./helpers/manageDB');
const Tareas = require('./models/tareas');



const main = async() => {
    
    let opt = '';
    const tareas = new Tareas();

    const tareasDB = readDB();

    if ( tareasDB ) {
        tareas.cargarTareasFromArray( tareasDB );
    }
    
    do {
        // Mostrar el menú
        opt = await inquirerMenu();

        // Leer opción seleccionada
        switch (opt) {
            case '1': // Crear tarea
                const desc = await leerInput('Descripción:');
                tareas.crearTarea( desc );
                break;
            case '2': // Listar
                tareas.listadoCompleto();
                break;
            case '3': // Listar completadas
                tareas.listarPendientesCompletadas(true);
                break;
            case '4': // Listar pendientes
                tareas.listarPendientesCompletadas(false);
                break;
            case '5': // Completado | Pendiente
                const ids = await mostrarListadoCheckList( tareas.listadoArr );
                tareas.toggleCompletadas( ids );
                break;
            case '6': // borrar
                 const id = await listadoTareasBorrar( tareas.listadoArr );
                 
                 if ( id !== '0' ) {
                     const ok = await confirm('¿Está seguro?');
                     if ( ok ) {
                        tareas.borrarTarea( id );
                        console.log('Tarea borrada'.green);
                     }
                 }
                break;
        }

        saveDB( tareas.listadoArr );

        await pause();
    
    } while ( opt !== '0' );
    
    // pause();
}

main()
