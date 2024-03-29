module.exports = {
    intituteDataFormatManager: (data,files) => {
        let relatedImages = files['relatedImages[]'];
        let titleImage = files?.titleImage;
        let relatedDocuments = files['relatedDocuments[]'];
        let relatedVideos = files['relatedVideos[]'];
        let baseUrl = process.env.BASE_URL || 'http://65.1.110.123:4000'
        if(titleImage?.length > 0) {
            data.titleImage =  baseUrl + '/' + titleImage[0].path.replaceAll('\\','/')
        }
        if(relatedImages?.length > 0) {
            let relatedImageArray = relatedImages.map((item) => baseUrl + '/' + item.path.replaceAll('\\','/'))
            data.relatedImages = relatedImageArray
        }
        if(relatedDocuments?.length > 0) {
            let relatedDocumentsArray = relatedDocuments.map((item) => baseUrl + '/' + item.path.replaceAll('\\','/'))
            data.relatedDocuments = relatedDocumentsArray 
        }
        if(relatedVideos?.length > 0) {
            let relatedVideosArray = relatedVideos.map((item) => baseUrl + '/' + item.path.replaceAll('\\','/'))
            data.relatedVideos = relatedVideosArray
        }

        const areaOfStudyArray = [];
        const teacherListArray = [];
        const aminitiesListArray = [];

        for(const key in data){
            if(key.startsWith('areaOfStudy')) {
                const match = key.match(/areaOfStudy-(\w+)-?(\d*)/);
                const index = match[2] || 1;
            
                if (!areaOfStudyArray[index - 1]) {
                  areaOfStudyArray[index - 1] = {};
                }
            
                areaOfStudyArray[index - 1][match[1]] = data[key];
            } else if (key.startsWith('teacherlist')) {
                // Handling teacherlist properties
                const match = key.match(/teacherlist-(\w+)-?(\d*)/);
                const index = match[2] || 1;
            
                if (!teacherListArray[index - 1]) {
                  teacherListArray[index - 1] = {};
                }
            
                teacherListArray[index - 1][match[1]] = data[key];
            } else if (key.startsWith('aminitiesList')) {
                // Handling aminitiesList properties
                const match = key.match(/aminitiesList-(\w+)-?(\d*)/);
                const index = match[2] || 1;
            
                if (!aminitiesListArray[index - 1]) {
                  aminitiesListArray[index - 1] = {};
                }
            
                aminitiesListArray[index - 1][match[1]] = data[key];
            }
        }

        let response = {
            name: data?.name,
            shortName: data?.shortName,
            email: data?.email,
            city: data?.city,
            district: data?.district,
            state: data?.state,
            phone:data?.phone,
            location: data?.location,
            description: data?.description,
            titleImage: (typeof data?.titleImage != 'object') ? data?.titleImage : '',
            relatedDocuments: (data?.relatedDocuments ? Object.keys(data?.relatedDocuments).length : 0) > 0 ? data?.relatedDocuments : [],
            relatedVideos: (data?.relatedVideos ? Object.keys(data?.relatedVideos).length : 0) > 0 ? data?.relatedVideos : [],
            relatedImages: (data?.relatedImages ? Object.keys(data?.relatedImages).length : 0) > 0 ? data?.relatedImages : [],
            countryId: data?.countryId,
            areasOfStudy: areaOfStudyArray,
            amenities: aminitiesListArray,
            teachersList: teacherListArray
        }

    
        return response;
    }
}