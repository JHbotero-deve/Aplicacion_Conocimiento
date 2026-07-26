async function enviarDatos(url, datos){
  const token = localStorage.getItem("token");
  const res = await fetch(url,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization": token ? "Bearer "+token : ""
    },
    body: JSON.stringify(datos)
  });
  return res.json();
}
