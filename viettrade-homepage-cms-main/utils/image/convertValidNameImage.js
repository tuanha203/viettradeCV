const convertValidNameImage = (name) => {
    if (!name) return false;
    let regex =
      /[^a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲÝỴÝỶỸửữựỳýỵỷỹ0-9\s\-()|_]+/;
  
    let _name = name.split(/(?=\.jpeg|\.png|\.jpg)/); //remove extension
    return [_name[0].replace(regex, ''), _name[1]].join('');
  };
  
  export default convertValidNameImage;