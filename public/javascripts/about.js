function resize(img){
    //원본 이미지 사이즈 저장
    var width = img.width;
    var height = img.height;

    //가로 세로 최대 사이즈 설정
    var maxWidth = width*0.5;
    var maxHeight = height*0.5;

    //가로나 세로의 길이가 최대 사이즈보다 크면 실행
    if(width > maxWidth || height > maxHeight){
        //가로가 세로보다 크면 가로는 최대사이즈로, 세로는 비율 맞춰 리사이즈
        if (width > height){
            resizeWidth = maxWidth;
            resizeHeight = Math.round((height * resizeWidth) / width);
        }else{
            //세로가 가로보다 크면 세로는 최대사이즈로, 가로는 비욜 맞춰 리사이즈
            resizeHeight = maxHeight;
            resizeWidth = Math.round((width * resizeHeight) / height);
        }
    }else{
        //최대사이즈보다 작으면 원본 그대로
        resizeWidth = width;
        resizeHeight = height;
    }

    //리사이즈한 크기로 이미지 크기 다시 지정
    img.width=resizeWidth;
    img.height=resizeHeight;   
}