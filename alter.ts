async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/fisioterapeuta/pacientes/12/rutinas/historial', {
      headers: {
        'Authorization': 'Bearer test' // Wait, I need a valid token. Let's just bypass auth or use the DB directly? I already did.
      }
    });
  } catch(e) {}
}
