;var Database = {

	/**
	 * @var IDBDatabase
	 */
	idb: null,

	/**
	 * @var string
	 */
	objectStoreName: '',

	init: function (dbName, version) {
		var idbOpenRequest;

		if (!dbName) {
			return;
		}

		if (!version || !isInt(version)) {
			version = 1;
		}

		this.setCompatibilityRequirements();
		idbOpenRequest = window.indexedDB.open(dbName, version);

		idbOpenRequest.onerror = function (event) {
			Database.log('Error while loading database.');
		};

		idbOpenRequest.onsuccess = function (event) {
			Database.idb = this.result;
			Database.log('Database initilized.');
		};

		idbOpenRequest.onupgradeneeded = function (event) {
			var idb = this.result;

			Database.log('Starting upgrade.');

			if (!idb.objectStoreNames.contains(objectStoreName)) {
				var store = idb.createObjectStore(objectStoreName, {
					keyPath: 'key',
					autoIncrement: true
				});
			}

			Database.log('Upgrade done.');
		};
	},

	/**
	 * @param objectStoreName
	 */
	setObjectStoreName: function (objectStoreName) {
		if (typeof objectStoreName == 'string' && objectStoreName !== '') {
			this.objectStoreName = objectStoreName;
		}
	},

	/**
	 * Returns the object store.
	 *
	 * @todo add name parameter
	 *
	 * @param mode
	 * @returns IDBObjectStore
	 */
	getObjectStore: function (mode) {
		var trans;

		if (!this.objectStoreName) {
			this.log('Error objectStoreName not set!');
			return null;
		}

		trans = this.idb.transaction([this.objectStoreName], mode);
		return trans.objectStore(this.objectStoreName);
	},

	findItem: function (key, callback) {
		var objectStore, request;

		if ('undefined' === typeof key) {
			return;
		}

		objectStore = this.getObjectStore('readonly');

		if (null !== objectStore) {
			request = objectStore.get(key);

			request.onsuccess = function (event) {
				var cursor = event.target.result;

				if ('function' === typeof callback) {
					callback(cursor);
				}
			};
		}
	},

	getAllItems: function (callback) {
		var range = window.IDBKeyRange.lowerBound(0);
		return this.select(range, callback);
	},

	select: function (range, callback) {
		var objectStore, request;

		objectStore = this.getObjectStore('readonly');

		if (null !== objectStore) {
			request = objectStore.openCursor(range);

			request.onsuccess = function (event) {
				var cursor = event.target.result;

				if (cursor) {
					if ('function' === typeof callback) {
						callback(cursor.value);
					}

					cursor.continue();
				}
			}
		}
	},

	save: function (item, callback) {
		if ('undefined' === typeof item) {
			return;
		}

		if ('undefined' === item.key) {
			this.insert(item, callback);
		}
		else {
			this.update(item, callback);
		}
	},

	insert: function (item, callback) {
		var objectStore, request;

		objectStore = this.getObjectStore('readwrite');

		if (null !== objectStore) {
			request = objectStore.put(item);

			request.onsuccess = function (event) {
				if ('function' === typeof callback) {
					callback(event.target.result);
				}
			}
		}
	},

	update: function (item, callback) {
		var objectStore = this.getObjectStore('readwrite');
console.log(objectStore);

		var keyRange = IDBKeyRange.only(2);
console.log(keyRange);

		var objCursor = objectStore.openCursor(keyRange);
console.log(objCursor);

		objCursor.onsuccess = function (event) {
console.log(event);
console.log(event.target.result.value);
		}
	},

	delete: function (key, callback) {
		var objectStore, request;

		objectStore = this.getObjectStore('readwrite');

		if (null !== objectStore) {
			request = objectStore.delete(key);

			request.onsuccess = function (event) {
				if ('function' === typeof callback) {
					callback(event.target.result);
				}
			}
		}
	},

	log: function (value) {
		if (console) {
			console.log(value);
		}
	},

	setCompatibilityRequirements: function () {
		window.indexedDB      = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
		window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
		window.IDBKeyRange    = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
	}
};