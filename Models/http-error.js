class httperror extends Error{
    constructor(message,errorcode){
        super(message);
        this.errorcode=errorcode;
    }
}
module.exports=httperror;