function route(app,url_map){
    console.log('app: %s',app);
    console.log('url_map: %s',url_map);
    for(var name in url_map){
        console.log('name: %s',name);

        element=url_map[name];
        path=element.path;
        respond=element.respond;

        console.log('path: %s\n---------------------------------------\n',path);
        app.post(path,respond);
    }
}

module.exports={
    route:route
}
