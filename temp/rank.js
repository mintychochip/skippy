class RankDatabase {
  constructor(databaseFilePath) {
    this.databaseFilePath = databaseFilePath;
    const sqlite3 = require('sqlite3').verbose();
    this.db = new sqlite3.Database(this.databaseFilePath);

    this.db.run(
      `
            CREATE TABLE IF NOT EXISTS ranks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            guild_id INTEGER NOT NULL,
            required_points INTEGER
            );
            `,
      (err) => {
        if (err) {
          console.error('[ERROR] Creating Table');
        }
      }
    );
  }
  async updateRankPoints(name, points, guildId) {
    return this.rankExists(name,guildId)
    .then((exists) => {
      if(!exists) {
        throw new RankDatabaseError(1);
      }

      const query = 'UPDATE ranks SET points = ? WHERE name = ? AND guild_id = ?;';

      return new Promise((resolve,reject) => {
        this.db.run(query,[points,name,guildId], err => {
          if(err) {
            reject(err);
            return;
          }

          if(this.changes === 0) {
            reject(new RankDatabaseError(2));
            return;
          }

          resolve(true);
        })
      })
    });
  }
  async updateRankName(oldName, newName, guildId) {
    return this.rankExists(oldName, guildId)
      .then((exists) => {
        if (!exists) {
          throw new RankDatabaseError(1);
        }

        const query =
          'UPDATE ranks SET name = ? WHERE name = ? AND guild_id = ?;';

        return new Promise((resolve, reject) => {
          this.db.run(query, [newName, oldName, guildId], err => {
            if (err) {
              reject(err);
              return;
            }

            if (this.changes === 0) {
              reject(new RankDatabaseError(2));
              return;
            }

            resolve(true);
          });
        });
      })
      .catch((err) => {
        console.error(err);
        throw err; // Propagate the error
      });
  }
  async getRank(name, guildId) {
    return new Promise((resolve, reject) => {
      const query = 'SELECT points FROM ranks WHERE name=? AND guild_id=?;';
      this.db.get(query, [name, guildId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        if (!row) {
          reject(new Error('there was no rank found'));
          return;
        }
        const rank = {
          name: name,
          guild_id: guildId,
          points: row.points,
        };
        console.log(rank);
        resolve(rank);
      });
    });
  }
  async rankExists(name, guildId) {
    return new Promise((resolve, reject) => {
      const query =
        'SELECT EXISTS (SELECT 1 FROM ranks WHERE name=? AND guild_id=?);';
      this.db.get(query, [name, guildId], (err, row) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(row['EXISTS'] === 1);
      });
    });
  }

  async insertRank(name, guildId) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO ranks (name,guild_id) VALUES (?,?)';
      this.db.run(query, [name, guildId], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
  }
  async insertRank(name, guildId, points) {
    return new Promise((resolve, reject) => {
      const query = 'INSERT INTO ranks (name,guild_id,points) VALUES (?,?,?)';
      this.db.run(query, [name, guildId, points], (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(this.lastID);
      });
    });
  }
}

class RankDatabaseError extends Error {
  static codes = {
    1: 'the rank does not exist',
    2: 'there was no rank found using name and guildId',
  };
  constructor(errorCode) {
    const message =
      RankDatabaseError.codes[errorCode] || 'strange, this is a bug';
    super(message);
    this.name = this.constructor.name;
    this.errorCode = errorCode;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
module.exports = { RankDatabase, RankDatabaseError };
