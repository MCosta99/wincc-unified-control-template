var fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var archiver = require('archiver');

if (!fs.existsSync('./out')){
    fs.mkdirSync('./out');
}
var m = JSON.parse(fs.readFileSync('manifest.json').toString());
var a = m.control.identity.type.toString();
a = a.replace('guid://','');

//update version number

var num = parseFloat(m.control.identity.version)+0.1;
var aabb= num.toFixed(1);
m.control.identity.version = aabb.toString();
fs.writeFileSync('manifest.json', JSON.stringify(m, null, "\t"));

var output = fs.createWriteStream('./out/{'+ a + '}.zip');
var archive = archiver('zip');

output.on('close', function () {
    console.log('\x1b[32m%s\x1b[0m', '=================================================='); 
    console.log('\x1b[32m%s\x1b[0m', '              Build ' + aabb +' Success!');
    console.log('\x1b[32m%s\x1b[0m', '=================================================='); 
    console.log('\x1b[32m%s\x1b[0m', ('             '+archive.pointer() + ' total bytes\n')); 
    console.log('\x1b[32m%s\x1b[0m', ('out \u2192 ' + '{'+ a + '}.zip\n')); 


    rl.question('\x1b[32mInstall into TIA project? [y/N] : \x1b[0m', (answer) => {
        answer = answer || 'n';
        if(answer=='y' | answer=='Y')
        {
            updateTiaProject();
            rl.close();
        }    
        else{
            rl.close();
            console.log('\x1b[33m%s\x1b[0m', '\nTo install in your project: Place in \\UserFiles\\CustomControls'); 
        }
    });
});
archive.on('error', function(err){
    throw err;
});
archive.pipe(output);

fs.readdirSync('./').forEach(file => {
    if (!(file=='out' | file=='temp' | file=='build.js' | file=='guid.js' | file=='node_modules' | file=='package-lock.json' | file=='package.json' |  file=='init.js')){
        if(fs.statSync('./'+file).isDirectory()){
            archive.directory(file+'/', file);
            console.log('\x1b[32m%s\x1b[0m', ('[Directory] \"'+file+'\" added to archive'));
        }
        else
        {
            archive.file(file, { name: file });
            console.log('\x1b[32m%s\x1b[0m', ('[File] \"'+file+'\" added to archive'));
        }
    }
  });
  
  archive.finalize();


function updateTiaProject() {

    var m = JSON.parse(fs.readFileSync('package.json').toString());
    var pathTIA = m.projectPathTIA.toString();
    
    if (!fs.existsSync(pathTIA+'\\UserFiles\\CustomControls')){
        fs.mkdirSync(pathTIA+'\\UserFiles\\CustomControls');
    }
    
    var m = JSON.parse(fs.readFileSync('manifest.json').toString());
    var a = m.control.identity.type.toString();
    guid = a.replace('guid://','');
    
    var oldPath = './out/{'+guid+'}.zip'
    var newPath = pathTIA+'\\UserFiles\\CustomControls\\{'+guid+'}.zip'
    
    fs.rename(oldPath, newPath, function (err) {
      if (err) throw err
      console.log('\x1b[32m%s\x1b[0m', 'Successfully installed in Tia Portal Project'); 
    })


}