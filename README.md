
# Install

    npm install
    mongo
      use lesa-recover
      db.reports.insert({name:"dummy report"})
      db.addUser({user:'lesa-recover', pwd: 'lesa-recover', roles: [ "dbAdmin" ] } )