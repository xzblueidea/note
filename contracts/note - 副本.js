'use strict';

var NoteContent = function (text) {
  if (text) {
    var o = JSON.parse(text);
    this.text=o.text;
    this.datetime=o.datetime;
    this.id=o.id;
    this.posx =o.posx;
    this.posy = o.posy;
  } else {
    this.text="";
    this.datetime="";
    this.id="";
    this.posx = 0;
    this.posy = 0;
  }
};

NoteContent.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var NoteContentArray = function (text) {
	this.list=new Array();
 	if (text) {
  		var jlist = JSON.parse(text);
  		for (var i=0;i<jlist.length;i++){
  			this.list.push(new NoteContent(JSON.stringify(jlist[i])));
  		}
  	}
};

NoteContentArray.prototype = {
  toString: function () {
    return JSON.stringify(this.list);
  },
  push:function(item){
  	  this.list.push(item);
  },
  remove:function(id){
  	  for (var i=0;i<this.list.length;i++) {
  	  	  if (this.list[i].id == id){
  	  	  	  this.list.splice(i,1);
  	  	  	  break;
  	  	  }
  	  }
  },
  setpos:function(id,posx,posy){
  	  for (var i=0;i<this.list.length;i++) {
  	  	  if (this.list[i].id == id){
  	  	  	  var note = this.list[i];
  	  	  	  note.posx = posx;
  	  	  	  note.posy = posy;
  	  	  	  break;
  	  	  }
  	  }
  }
};

var NoteContract = function () {
  LocalContractStorage.defineMapProperty(this, "noteMap", {
    parse: function (text) {
      return new NoteContentArray(text);
    },
    stringify: function (o) {
      return o.toString();
    }
  });
};

// save value to contract, only after height of block, users can takeout
NoteContract.prototype = {
  init: function () {
    //TODO:
  },
  save: function (id,text,datetime,posx,posy) {
    var from = Blockchain.transaction.from;
    var noteArray = this.noteMap.get(from);
    if (noteArray == null){
    	noteArray = new NoteContentArray(null);
    }
    var note = new NoteContent();
    note.id = id;
    note.text = text;
    note.datetime = datetime;
    note.posx = posx;
    note.posy = posy;
    noteArray.push(note);
    this.noteMap.set(from, noteArray);
  },
  remove: function (id) {
    var from = Blockchain.transaction.from;
    var noteArray = this.noteMap.get(from);
    if (noteArray == null) {
    	noteArray = new NoteContentArray(null);
    }
    this.noteMap.put(from, noteArray);
  },
  setpos:function(id,posx,posy){
  	var from = Blockchain.transaction.from;
    var noteArray = this.noteMap.get(from);
    if (noteArray == null){
    	noteArray = new NoteContentArray(null);
    }
    noteArray.setpos(id,posx,posy);
    this.noteMap.set(from, noteArray);
  },
  getall: function () {
    var from = Blockchain.transaction.from;
    var ret =this.noteMap.get(from)
    if (ret == null) {
    	ret = new NoteContentArray(null);
    }
    return JSON.parse(ret.toString());
  },
  verifyAddress: function (address) {
    // 1-valid, 0-invalid
    var result = Blockchain.verifyAddress(address);
    return {
      valid: result == 0 ? false : true
    };
  }
};
module.exports = NoteContract;