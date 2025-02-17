import handlebars from 'express-handlebars';

export default function handlebarsSetup(app) {
    app.engine('hbs', handlebars.engine({
        extname: 'hbs',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
        }
    }));
    app.set('view engine', 'hbs');
    app.set('views', './src/views');
}