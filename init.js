const readline = require('readline');
fs = require('fs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


rl.question('\x1b[32mProject Name: \x1b[0m', (answer) => {
    var name = answer.replace(' ','');
    var display_name= answer;
    rl.question('\x1b[32mProject Version [1.0]: \x1b[0m', (answer) => {
        var version= answer || '1.0';
        rl.question('\x1b[32mAuthor [Me]: \x1b[0m', (answer) => {
            var author = answer || 'Me';
            rl.question('\x1b[32mHTML Main file [./control/index.html]: \x1b[0m', (answer) => {
                var file_name = answer || './control/index.html';                
                const guid = require('./guid')
                var m = JSON.parse(fs.readFileSync('manifest.json').toString());
                m.control.identity.name = name;
                m.control.identity.displayname = display_name;
                m.control.identity.version = version;
                m.control.identity.start = file_name;
                m.control.metadata.author = author;
                fs.writeFileSync('manifest.json', JSON.stringify(m, null, "\t"));

                rl.question('\x1b[32mConnect Project [Y/n]: \x1b[0m', (answer) => {
                  answer = answer || 'y';
                  if(answer=='y' | answer=='Y')
                  {
                    rl.question('\x1b[32mProject Path : \x1b[0m', (answer) => {
                      
                      var pack = JSON.parse(fs.readFileSync('package.json').toString());
                      pack.projectPathTIA=answer;
                      fs.writeFileSync('package.json', JSON.stringify(pack, null, "\t"));
                      console.log("\x1b[32m DONE!");
                      rl.close();
                    });
                  }
                  else{
                    console.log("\x1b[32m DONE!");
                    rl.close();
                  }
                });


            });
        });
      });
});