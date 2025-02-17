import {Injectable} from '@angular/core';
import {User} from "../models/user.model";
import {Scan} from "../models/scan.model";
import {DietRestriction} from "../models/dietRestriction.model";
import {Product} from "../models/product.model";

declare function openDatabase(shortName: string, version: string,
                              displayName: string,
                              dbSize: number,
                              dbCreateSuccess: any): any;


@Injectable({
    providedIn: 'root'
})
export class DatabaseService {

    private db: any = null;


    constructor() {
    }

    public static errorHandler(error: any) {
        console.error(`Error: ${error}`);
        throw(error);
    }

    private createDatabase(): void {
        var shortName = "DietScannerApp";
        var version = "1.0";
        var displayName = "DB for Angular diet scanner app";
        var dbSize = 2 * 1024 * 1024;

        this.db = openDatabase(shortName, version, displayName, dbSize, () => {
            console.log("Success: Database created successfully");
        });
    }

    public getDatabase(): any {
        if (this.db == null) {
            this.createDatabase();
        }
        return this.db;
    }

    createTables() {
        function txFunction(tx: any) {
            let options: any[] = [];
            let userTablesql: string = "CREATE TABLE IF NOT EXISTS users(" //significant without frequent updates
                + "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "
                + "name VARCHAR(20) NOT NULL, "
                + "gluten INTEGER(1),"
                + "dairy INTEGER(1),"
                + "treenut INTEGER(1),"
                + "peanut INTEGER(1),"
                + "customIngredients VARCHAR(300)"
                + ");";
            let productTableSql: string = "CREATE TABLE IF NOT EXISTS products(" + //significant
              "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
              "productName VARCHAR(30)," +
              "ingredientsList TEXT" +
              ");";
            let scansTableSql: string = "CREATE TABLE IF NOT EXISTS scans(" +
              "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
              "userID INTEGER NOT NULL," +
              "productID INTEGER NOT NULL," +
              "triggerFound VARCHAR(1)," +
              "matchedIngredients TEXT" +
              ");";

            tx.executeSql(userTablesql, options, () => {
                console.log("Success: Users Table created successfully")
            }, DatabaseService.errorHandler);
            tx.executeSql(productTableSql, options, ()=>{
              console.log("Success: products table created successfully")
            }, DatabaseService.errorHandler);
          tx.executeSql(scansTableSql, options, () => {
            console.log("Success: Scans table created successfully")
          }, DatabaseService.errorHandler);

        }

        this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, () => {
            console.log("Success: create transaction successful");
        });
    }

  //dietRestrictions fill, read methods
  public createDietRecords(){
    function txFunction(tx: any) {
      let options:any = [];
      let dropTable:string = 'DROP TABLE IF EXISTS dietRestriction;';
      let createTable: string = "CREATE TABLE IF NOT EXISTS dietRestriction(" + //lookup table
        "id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT," +
        "restrictionName VARCHAR(20) NOT NULL," +
        "triggerIngredients VARCHAR(1000)" +
        ");";

      tx.executeSql(dropTable, options, (tx: any, results: any) => {
        //notify the caller
      }, DatabaseService.errorHandler);
      tx.executeSql(createTable, options, (tx: any, results: any) => {
        //notify the caller
      }, DatabaseService.errorHandler);
      // tx.executeSql(fillTable, options, (tx: any, results: any) => {
      //   //notify the caller
      // }, DatabaseService.errorHandler);
    }

    this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, () => {
      console.info("Success: Diet records filled successfully");
    });
  }

  public fillDietRestrictionRecords(): Promise<any> {
    return new Promise((resolve, reject) => {
      function txFunction(tx: any) {
        let fillTable = 'INSERT INTO dietRestriction (restrictionName, triggerIngredients) ' +
          'VALUES ("Gluten", "wheat, wheat flour, durum, emmer, semolina, spelt, farina, farro, graham, kamut, khorasan wheat, einkorn wheat, rye, barley, triticale, malt, brewer\'s yeast, wheat' +
          ' flour, bulgur, hydrolyzed wheat protein, matzo, modified wheat starch, seitan, wheat bran, wheat germ, wheat starch, atta, fu, wheat berries, couscous"), ' +
          '("Dairy", "milk, modified milk ingredients, skim milk, buttermilk, butter, yogurt, cheese, whey, lactose, lactate, chocolate, dried milk, casein, caseinate, condensed milk, cultured' +
          ' milk, cream,' +
          ' evaporated milk, lactoalbumin, lactoglobulin, lactoferrin, milk fat, modified milk ingredients, milk protein, milk powder, sour milk solids, ghee, lactulose"), ' +
          '("Tree Nuts", "almonds, almond, brazil nuts, cashews, cashew, hazelnut, hazelnut, filberts, hazelnuts(filberts), macadamia nuts, pecans, pine nuts, pine nut, pistachios, pistachio,' +
          ' walnuts"), ' +
          '("Peanuts", "arachide, arachis oil, beer nuts, almond paste, hazelnut paste, marzipan, nougat, peanuts, peanut, peanutbutter, peanut butter, peanut-butter hydrolyzed plant protein,' +
          ' peanut oil");';
        let options:any = [];

        tx.executeSql(fillTable, options, (tx: any, results: any) => {
          //notify the caller
          resolve(results);
        }, DatabaseService.errorHandler);
      }

      this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, () => {
        console.info("Success: insert transaction successful");
      });
    });
  }

    dropTables() {
        function txFunction(tx: any) {
            let options: any[] = [];
            let sql: string = "DROP TABLE IF EXISTS users;";
            let sql2: string = "DROP TABLE IF EXISTS dietRestriction;";
            let sql3: string = "DROP TABLE IF EXISTS products";
            let sql4: string = "DROP TABLE IF EXISTS scans;";

            tx.executeSql(sql, options, () => {
                console.log("Success: Users table dropped successfully")
            }, DatabaseService.errorHandler);
          tx.executeSql(sql2, options, () => {
            console.log("Success: DietRestriction table dropped successfully")
          }, DatabaseService.errorHandler);
          tx.executeSql(sql3, options, () => {
            console.log("Success: Products table dropped successfully")
          }, DatabaseService.errorHandler);
          tx.executeSql(sql4, options, () => {
            console.log("Success: Scans table dropped successfully")
          }, DatabaseService.errorHandler);

        }

        this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, () => {
            console.log("Success: drop transaction successful");
        });
    }

    public initDB() {
        try {
            this.createDatabase();
            this.createTables();
            this.createDietRecords();
            this.fillDietRestrictionRecords();
        } catch (err: any) {
            console.log("Error in initDB: " + err.message);
        }
    }

    public clearDB() {
        let result = confirm("Really want to clear database?");
        if (result) {
            this.dropTables();
            this.db = null;
            alert("Database cleared");
        }
    }



  public selectAllDiets(): Promise<any> {
    return new Promise((resolve, reject) => {
      function txFunction(tx: any) {
        let sql = 'SELECT * FROM dietRestriction;';
        let options: any[] = [];

        tx.executeSql(sql, options, (tx: any, results: any) => {

          let dietRestrictions: DietRestriction[] = [];
          for (var i = 0; i < results.rows.length; i++) {
            let row = results.rows[i];
            let dr = new DietRestriction(row['restrictionName'], row['triggerIngredients']);
            dr.id = row['id'];

            dietRestrictions.push(dr);
          }
          //notify the caller
          resolve(dietRestrictions);
        }, DatabaseService.errorHandler);
      }

      this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, () => {
        console.info("Success: selectAll diet restrictions transaction successful");
      });
    });
  }

  public selectDiet(id:number): Promise<any> {
    return new Promise((resolve, reject) => {
      function txFunction(tx: any) {
        let sql = 'SELECT * FROM dietRestriction WHERE id = ?;';
        let options: any[] = [id];

        tx.executeSql(sql, options, (tx: any, results: any) => {

          let dietRestrictions: DietRestriction[] = [];
          if (results.rows.length > 0) {
            let row = results.rows[0];
            let dr = new DietRestriction(row['restrictionName'], row['triggerIngredients']);
            dr.id = row['id'];
            resolve(dr);
          }
          //notify the caller
          resolve(dietRestrictions);
        }, DatabaseService.errorHandler);
      }

      this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, () => {
        console.info("Success: select diet restrictions transaction successful");
      });
    });
  }




    //User CRUD
    public insertUser(user: User): Promise<any> {
        return new Promise((resolve, reject) => {
            function txFunction(tx: any) {
                let sql = 'INSERT INTO users(name, gluten, dairy, treenut, peanut, customIngredients) VALUES(?, ?, ?, ?, ?, ?);';
                let options = [user.name, user.gluten, user.dairy, user.treenut, user.peanut, user.customIngredients];

                tx.executeSql(sql, options, (tx: any, results: any) => {
                    //notify the caller
                    resolve(results);
                }, DatabaseService.errorHandler);
            }

            this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, () => {
                console.info("Success: insert transaction successful");
            });
        });
    }

    public selectAllUsers(): Promise<any> {
        return new Promise((resolve, reject) => {
            function txFunction(tx: any) {
                let sql = 'SELECT * FROM users;';
                let options: any[] = [];

                tx.executeSql(sql, options, (tx: any, results: any) => {

                    let users: User[] = [];
                    for (var i = 0; i < results.rows.length; i++) {
                        let row = results.rows[i];
                        let u = new User(row['name'], row['gluten'], row['dairy'], row['treenut'], row['peanut'], row['customIngredients']);
                        u.id = row['id'];

                        users.push(u);
                    }
                    //notify the caller
                    resolve(users);
                }, DatabaseService.errorHandler);
            }

            this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, () => {
                console.info("Success: selectAll transaction successful");
            });
        });
    }

    public deleteUser(user: User): Promise<any> {
        return new Promise((resolve, reject) => {
            function txFunction(tx: any) {
                let sql = 'DELETE FROM users WHERE id=?;';
                let options = [user.id];

                tx.executeSql(sql, options, (tx: any, results: any) => {
                    //notify the caller
                    resolve(results);
                }, DatabaseService.errorHandler);
            }

            this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, () => {
                console.info("Success: delete transaction successful");
            });
        });
    }

    public selectUser(id: number): Promise<any> {
        return new Promise((resolve, reject) => {
            function txFunction(tx: any) {
                let sql = 'SELECT * FROM users WHERE id=?;';
                let options: any[] = [id];

                tx.executeSql(sql, options, (tx: any, results: any) => {
                    if (results.rows.length > 0) {
                      let row = results.rows[0];
                      let u = new User(row['name'], row['gluten'], row['dairy'], row['treenut'], row['peanut'], row['customIngredients']);
                      u.id = row['id'];
                      resolve(u);
                    }
                    else{
                      reject("No record found");
                    }
                }, DatabaseService.errorHandler);
            }

            this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, () => {
                console.info("Success: select transaction successful");
            });
        });
    }

    public updateUser(user: User): Promise<any> {
        return new Promise((resolve, reject) => {
            function txFunction(tx: any) {
                let sql = 'UPDATE users SET name=?, gluten=?, dairy=?, treenut=?, peanut=?  WHERE id=?;';
                let options = [user.name, user.gluten, user.dairy, user.treenut, user.peanut ,user.id];

                tx.executeSql(sql, options, (tx: any, results: any) => {
                    //notify the caller
                    resolve(results);
                }, DatabaseService.errorHandler);
            }

            this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, () => {
                console.info("Success: update transaction successful");
            });
        });
    }

    //ingredients stuff
  public updateUserIngredients(user: User): Promise<any> {
    return new Promise((resolve, reject) => {
      function txFunction(tx: any) {
        let sql = 'UPDATE users SET customIngredients=?  WHERE id=?;';
        let options = [user.customIngredients ,user.id];

        tx.executeSql(sql, options, (tx: any, results: any) => {
          //notify the caller
          resolve(results);
        }, DatabaseService.errorHandler);
      }

      this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, () => {
        console.info("Success: update transaction successful");
      });
    });
  }

    //products CRUD
  public insertProduct(product: Product): Promise<any> {
    return new Promise((resolve, reject) => {
      function txFunction(tx: any) {
        let sql1 = 'INSERT INTO products(productName, ingredientsList) VALUES(?, ?);';
        let options1 = [product.productName, product.ingredientsList];
        let productID = -1;

          tx.executeSql(sql1, options1, (tx: any, results: any) => {
            resolve(results);
          }, DatabaseService.errorHandler);
        }

      this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, () => {
        console.info("Success: insert transaction successful");
      });
    });
  }

  public updateProduct(product: Product): Promise<any> {
    return new Promise((resolve, reject) => {
      function txFunction(tx: any) {
        let sql = 'UPDATE products SET productName=?, ingredientsList=? WHERE id=?;';
        let options = [product.productName, product.ingredientsList, product.id];

        tx.executeSql(sql, options, (tx: any, results: any) => {
          resolve(results);
        }, DatabaseService.errorHandler);
      }

      this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, () => {
        console.info("Success: insert transaction successful");
      });
    });
  }

  public selectAllProducts(): Promise<any> {
    return new Promise((resolve, reject) => {
      function txFunction(tx: any) {
        let sqlProducts = 'SELECT * FROM products;';
        let optionsProducts: any[] = [];

        tx.executeSql(sqlProducts, optionsProducts, (tx: any, results: any) => {
          let products: Product[] = [];
          for (var i = 0; i < results.rows.length; i++) {
            let row = results.rows[i];
            let pr = new Product(row['productName'], row['ingredientsList'], new Scan(-1, -1, false, ""));
            pr.id = row['id'];

            products.push(pr);
          }
          //notify the caller
          resolve(products);
        }, DatabaseService.errorHandler);
      }

      this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, () => {
        console.info("Success: selectAll transaction successful");
      });
    });
  }

  public selectProduct(productID:number): Promise<any> {
    return new Promise((resolve, reject) => {
      function txFunction(tx: any) {
        let sql = 'SELECT * FROM products WHERE id = ?;';
        let options: any[] = [productID];

          tx.executeSql(sql, options, (tx: any, results: any) => {
            if (results.rows.length > 0) {
              let row = results.rows[0];
              let pr = new Product(row['productName'], row['ingredientsList'], new Scan(row['userID'], row['productID'], row['triggerFound'], row['matchedIngredients']));
              pr.id = row['id'];
              resolve(pr);
            }
            else{
              reject("No record found");
            }
          }, DatabaseService.errorHandler);
      }

      this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, () => {
        console.info("Success: selectAll transaction successful");
      });
    });
  }

  public deleteProduct(product:Product): Promise<any> {
    return new Promise((resolve, reject) => {
      function txFunction(tx: any) {
        let sql = 'DELETE FROM products WHERE id=?;';
        let options = [product.id];

        tx.executeSql(sql, options, (tx: any, results: any) => {
          //notify the caller
          resolve(results);
        }, DatabaseService.errorHandler);
      }

      this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, () => {
        console.info("Success: delete transaction successful");
      });
    });
  }


    //previousScans CRUD
  public insertScan(scan: Scan): Promise<any> {
    return new Promise((resolve, reject) => {
      function txFunction(tx: any) {
        let sql = 'INSERT INTO scans(userID, productID, triggerFound, matchedIngredients) VALUES(?, ?, ?, ?);';
        let options = [scan.userID, scan.productID, scan.triggerFound, scan.matchedIngredients];

        tx.executeSql(sql, options, (tx: any, results: any) =>{
          //notify the caller
          resolve(results);
        }, DatabaseService.errorHandler);
      }

      this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, () => {
        console.info("Success: insert transaction successful");
      });
    });
  }

  public selectUserScans(userID:number): Promise<any> {
    return new Promise((resolve, reject) => {
      function txFunction(tx: any) {
        let sql = 'SELECT * FROM scans WHERE userID = ?;';
        let options: any[] = [userID];

        tx.executeSql(sql, options, (tx: any, results: any) => {

          let scans: Scan[] = [];
          for (var i = 0; i < results.rows.length; i++) {
            let row = results.rows[i];
            let sc = new Scan(row['userID'], row['productID'], row['triggerFound'], row['matchedIngredients']);
            sc.id = row['id'];

            scans.push(sc);
          }
          //notify the caller
          resolve(scans);
        }, DatabaseService.errorHandler);
      }

      this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, () => {
        console.info("Success: selectAll transaction successful");
      });
    });
  }

  public deleteScan(scan: Scan): Promise<any> {
    return new Promise((resolve, reject) => {
      function txFunction(tx: any) {
        let sql = 'DELETE FROM scans WHERE id=?;';
        let options = [scan.id];

        tx.executeSql(sql, options, (tx: any, results: any) => {
          //notify the caller
          resolve(results);
        }, DatabaseService.errorHandler);
      }

      this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, () => {
        console.info("Success: delete transaction successful");
      });
    });
  }

  public deleteProductScans(productID:number): Promise<any> {
    return new Promise((resolve, reject) => {
      function txFunction(tx: any) {
        let sql = 'DELETE FROM scans WHERE productID=?;';
        let options = [productID];

        tx.executeSql(sql, options, (tx: any, results: any) => {
          //notify the caller
          resolve(results);
        }, DatabaseService.errorHandler);
      }

      this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, () => {
        console.info("Success: delete transaction successful");
      });
    });
  }

  public deleteUserScans(userID:number): Promise<any> {
    return new Promise((resolve, reject) => {
      function txFunction(tx: any) {
        let sql = 'DELETE FROM scans WHERE userID=?;';
        let options = [userID];

        tx.executeSql(sql, options, (tx: any, results: any) => {
          //notify the caller
          resolve(results);
        }, DatabaseService.errorHandler);
      }

      this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, () => {
        console.info("Success: delete transaction successful");
      });
    });
  }

  public selectScan(id: number): Promise<any> {
    return new Promise((resolve, reject) => {
      function txFunction(tx: any) {
        let sql = 'SELECT * FROM scans WHERE id=?;';
        let options: any[] = [id];

        tx.executeSql(sql, options, (tx: any, results: any) => {
          if (results.rows.length > 0) {
            let row = results.rows[0];
            let sc = new Scan(row['userID'], row['productID'], row['triggerFound'], row['matchedIngredients']);
            sc.id = row['id'];
            resolve(sc);
          }
          else{
            reject("No record found");
          }
        }, DatabaseService.errorHandler);
      }

      this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, () => {
        console.info("Success: select transaction successful");
      });
    });
  }

  public updateScan(scan: Scan): Promise<any> {
    return new Promise((resolve, reject) => {
      function txFunction(tx: any) {
        let sql = 'UPDATE scans SET userID=?, productID=?, triggerFound=?, matchedIngredients=? WHERE id=?;';
        let options = [scan.userID, scan.productID, scan.triggerFound, scan.matchedIngredients ,scan.id];

        tx.executeSql(sql, options, function(tx: any, results: any){
          //notify the caller
          resolve(results);
        }, DatabaseService.errorHandler);
      }

      this.getDatabase().transaction(txFunction, DatabaseService.errorHandler, () => {
        console.info("Success: update transaction successful");
      });
    });
  }


}
