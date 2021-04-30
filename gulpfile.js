 	// Определяем константы Gulp
const { src, dest, watch, parallel, series, task }  = require('gulp');

// Подключаем Browsersync
const browserSync   = require('browser-sync').create(); //Синхронизация с браузером

// Подключаем gulp-concat
const concat = require('gulp-concat');
 
// Подключаем gulp-uglify-es Оптимизация скриптов
const uglify = require('gulp-uglify-es').default;  // 1 вариант или или

// Подключаем gulp-uglify-es Оптимизация скриптов
// const uglify = require('gulp-uglify');   // 2 вариант  или или

//Для препроцессоров стилей
const sourcemaps = require('gulp-sourcemaps');

//Sass препроцессор
const sass = require('gulp-sass');

//Добапвление префиксов
const autoprefixer = require('gulp-autoprefixer');

//Оптисизация стилей
const cleancss = require('gulp-clean-css');

// Подключаем gulp-imagemin для работы с изображениями
const imagemin = require('gulp-imagemin');
 
// Подключаем модуль gulp-newer
const newer = require('gulp-newer');
 
// Подключаем модуль del
const del = require('del');


//oooooooooooooooooooooooooooooooooooooooooooooooooo
//oooooooooooooooooooooooooooooooooooooooooooooooooo
//Порядок подключения js файлов
const scriptFiles = [
  'node_modules/jquery/dist/jquery.js', // Gодключения библиотеки
  'node_modules/slick-carousel/slick/slick.js',  // библиотека карусель-слайдер
  'app/js/main.js'  // Пользовательские скрипты
]

//Порядок подключения файлов со стилями
const styleFiles = [
  'node_modules/slick-carousel/slick/slick.css',
  'node_modules/animate.css/animate.css',
  'app/scss/style.scss'
]

const buildFiles = [
  'app/css/style.min.css',
  'app/fonts/**/*',
  'app/js/main.min.js',
  'app/*.html',
  'app/images/**/*'
]

//---------------------------------------
//---------------------------------------
//---------------------------------------

function scripts() {
  return src( scriptFiles ) // Файлы из массива scriptFiles
    .pipe(concat('main.min.js'))  // Конкатенируем в один файл
    .pipe(uglify())  // Сжимаем JavaScript
    .pipe(dest('app/js'))  // Выгружаем готовый файл в папку назначения
    .pipe(browserSync.stream())  // Запуск Browsersync для обновления
}

function scsstocss() {
  	return src('app/scss/style.scss')
    .pipe(sass())
    .pipe(concat('style.css')) // Конкатенируем в файл 
    .pipe(dest('app/css')) // Выгрузим результат в папку 
}


function styles() {
	return src(styleFiles) // // Файлы из массива
  .pipe(sourcemaps.init())
  .pipe(sass())
	.pipe(concat('style.min.css')) // Конкатенируем в файл 
	.pipe(autoprefixer({  // Создадим префиксы с помощью Autoprefixer
     overrideBrowserslist: ['last 10 versions'], 
     grid: true,
     cascade: false
    })) 
    .pipe(cleancss({   // Минифицируем стили
      level: { 1: { specialComments: 0 } }/* , format: 'beautify' */ 
    }))
  .pipe(sourcemaps.write('./'))
	.pipe(dest('app/css')) // Выгрузим результат в папку 
	.pipe(browserSync.stream()) // Сделаем инъекцию в браузер
}

function images() {
  return src('app/images/**/*')
    .pipe(newer('build/images')) // Проверяем, было ли изменено (сжато) изображение ранее
    .pipe(imagemin(  // Сжимаем и оптимизируем изображеня
      [
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [
            { removeViewBox: true },
            { cleanupIDs: false }
          ]
        })
      ]
    ))
    .pipe(dest('build/images'))
}


// Определяем логику работы Browsersync
function browsersync() { //название функции не должно совпадать с названием переменной
	browserSync.init({ // Инициализация Browsersync
		server: { baseDir: 'app/' }, // Указываем папку сервера
		notify: false, // Отключаем уведомления
		online: true // Режим работы: true или false
	})
}

function startwatch() {  // автоматическое обновление при сохранении скриптов
	// Выбираем все файлы JS в проекте, а затем исключим с суффиксом .min.js
	watch(['app/**/*.js', '!app/**/*.min.js'], scripts);

	// Мониторим файлы препроцессора на изменения
	// watch(['app/scss/**/*.scss'], styles);
	watch(['app/scss/**/*.scss'], styles);
	watch(['app/scss/**/*.scss'], scsstocss);
 
	// Мониторим файлы HTML на изменения
	watch('app/**/*.html').on('change', browserSync.reload);

  // Мониторим файлы изображений
  watch('.app/images/**', images);
}

// Очистка папки build
function cleanbuild() {
  return del('build')
}

function build() {
  return src(buildFiles, {base: 'app'})
    .pipe(newer('build')) // Проверяем, были ли измененияранее
    .pipe(dest('build'))
}
// exports  exports  exports  exports  exports
// exports  exports  exports  exports  exports
// exports  exports  exports  exports  exports


// Экспортируем функцию browsersync() как таск browsersync. Значение после знака = это имеющаяся функция.
// exports.browsersync = browsersync;
 
// Экспортируем функцию scripts() в таск scripts
// exports.scripts = scripts;
 
// Экспортируем функцию styles() в таск styles
// exports.styles = styles;
 
// Экспорт функции images() в таск images
// exports.images = images;
 
// Экспортируем функцию cleanimg() как таск cleanimg
// exports.cleanimg = cleanimg;
 
// Создаём новый таск "build", который последовательно выполняет нужные операции
// exports.build = series(cleandist, styles, scripts, images, buildcopy);
 
exports.build = series(images,build);  //  gulp build
exports.del = cleanbuild;  //  gulp del
// Экспортируем дефолтный таск с нужным набором функций
exports.default = parallel(scsstocss, styles, scripts, browsersync, startwatch);









//=========================================
//=========================================
//=========================================


// task('sync', () => {
//   browserSync.init({ // Инициализация Browsersync
// 		server: { baseDir: 'app/' }, // Указываем папку сервера
// 		notify: false, // Отключаем уведомления
// 		online: true // Режим работы: true или false
// 	});
// });
//Таск по умолчанию, Запускает del, styles, scripts, img-compress и watch
// task('default', parallel('sync'));