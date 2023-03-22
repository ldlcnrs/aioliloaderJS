class AioliLoader {

	  /**
	  * This function allow to get the list of public projects from an Heritage Asset ID
	  * id must be a string
	  */

	  static async publicInHeritageAsset(id){
	    let byHaPath = `${Potree.aioliPath}/couch/projects/_design/queryfilter/_view/by_ha_and_public?id=` + id;
	    const promise = new Promise((resolve) => {

	      $.getJSON(byHaPath, function(publicProjects){
	        let listProjectsData = [];
	        for (let i=0; i<publicProjects.rows.length; i++){
	          // A REMPLACER PAR UN MAP OU UN FILTER
	          if(publicProjects.rows[i].value.heritage == id){

	            let data = {
	              id: publicProjects.rows[i].id,
	              title: publicProjects.rows[i].value.title,
	              owner: publicProjects.rows[i].value.owner
	            };

	            listProjectsData.push(data);

	          }
	        }

	        resolve(listProjectsData);

	      });

	    });


	    return promise;

	  };


	  /**
	  * This function allows to get data from an id of an Aioli public project
	  * id must be a string
	  */
	  static async loadProjectData(id){

	    let projectDataPath = `${Potree.aioliPath}/_data/public?id=` + id;

	    const promise = new Promise((resolve) => {

	      $.getJSON(projectDataPath, function(projectData){
	        console.log(projectData);
	        let data = {
	          metadata: projectData,
	          name: projectData.projectData.title,
	          owner: projectData.projectData.owner,
	          densecloudPath: Potree.aioliPath + "/workspace/usr/" + projectData.projectData.owner + "/projects/" + id + "/chantier/MicMac/Potree_dense/resources/pointclouds/webcloud/cloud.js",
	          calibExternePath: Potree.aioliPath + "/workspace/usr/" + projectData.projectData.owner + "/projects/" + id + "/chantier/export.txt",
	          calibInternePath: Potree.aioliPath + "/workspace/usr/" + projectData.projectData.owner + "/projects/"  + id + "/chantier/Json/threeJSON.json",
	          imagesPath: Potree.aioliPath + "/workspace/usr/" + projectData.projectData.owner + "/projects/"  + id + "/chantier/Images/"
	        };

	        resolve(data);
	      });

	    });
	    return promise;

	  };

	  /**
	  * This function allows to retrieve, from an Aioli project id, all groups data related to the project
	  * id must be a string (project ID)
	  */
	  static async getGroups(id){

	    const promise = new Promise ((resolve) => {

	      const getGroupsPath = `${Potree.aioliPath}/_data/get_groups?id=` + id;

	      $.getJSON(getGroupsPath, function(groups){
	        //do something ?

	        /*let filteredGroup = [];
	        // filtre pour ne retenir que les données concernant les groupes sélectionnés par l'utilisateur parmis les groupes du projet
	        if (psGroups !== null){
	          for (const i in psGroups){
	            for (const j in groups){
	              if (groups[j].id === psGroups[i]){
	                filteredGroup.push(groups[j]);
	                console.log(filteredGroup);
	              }
	            }
	          }
	          groups = filteredGroup;
	          console.log(groups);
	        }*/
	        resolve(groups);
	      });

	    });

	    return promise;
	  }

	  static async getGroupsData(id){

	    const promise = new Promise ((resolve) => {

	      const getGroupsPath = `${Potree.aioliPath}/_data/get_groups?id=` + id;

	      $.getJSON(getGroupsPath, function(groups){
	        let groupsData = [];

	        for(const i in groups){
	        //for(let i=0; i<groups.length; i++){
	          console.log(groups[i]);
	          let data = {
	            id: groups[i].id,
	            name: groups[i].name,
	            owner: groups[i].owner,
	            project: id
	          };

	          groupsData.push(data);
	        }
	        //do something ?
	        resolve(groupsData);
	        console.log('les données de groupe du projet ' + id + ' sont : ', groupsData);
	      });

	    });

	    return promise;
	  }

	  /**
	  * This function allows to retrieve, from a group ID, the data of all the layers included in the group
	  * id must be a string (group ID)
	  */
	  static async getLayers(id){

	    const promise = new Promise ((resolve) => {

	      const getLayersPath = `${Potree.aioliPath}/_data/get_layers?id=` + id;

	      $.getJSON(getLayersPath, function(layers){
	          // do something ?
	          resolve(layers);
	      });


	    });
	    return promise;
	  }

	  static async getLayersData(id){

	    const promise = new Promise ((resolve) => {

	      const getLayersPath = `${Potree.aioliPath}/_data/get_layers?id=` + id;

	      $.getJSON(getLayersPath, function(layers){
	        let layersData = [];

	        for (const i in layers){
	          console.log(layers[i]);
	          let data = {
	            id: layers[i].id,
	            name: layers[i].name,
	            owner: layers[i].owner,
	            project: layers[i].project,
	            group: id
	          };

	          layersData.push(data);
	          console.log('les données de calque du groupe ' + id + ' sont : ', layersData);

	        }
	          // do something ?
	          resolve(layersData);

	      });


	    });
	    return promise;
	  }

	  /**
	  * This function allows to retrieve, from a layer ID, the data of all the annotations in the layer
	  * id must be a string (layer ID)
	  */
	  static async getAnnotations(id){

	    const promise = new Promise ((resolve) => {

	      const getAnnotationsPath = `${Potree.aioliPath}/_data/get_annotations?id=` + id;

	      $.getJSON(getAnnotationsPath, function(annotations){
	          // do something ?
	          resolve(annotations);
	      });

	    });
	    return promise;
	  }


	  /**
	  * This function allows to ...
	  * layers json
	  * annotations json
	  */
	  static async computeLayersPositions(layers, annotations){
	    const promise = new Promise ((resolve) => {
	      let positions = [];
	      let normals = [];
	      let result = [];

	      for (const i in layers.ids){
	        const annots = annotations.annotationsData.filter(a => a.parent === layers.ids[i]);
	        let x = annots.map(a => a.json_details.PCBarycenter[0]).reduce((pv, cv) => pv + cv, 0);
	        let y = annots.map(a => a.json_details.PCBarycenter[1]).reduce((pv, cv) => pv + cv, 0);
	        let z = annots.map(a => a.json_details.PCBarycenter[2]).reduce((pv, cv) => pv + cv, 0);
	        positions[layers.ids[i]] = [x/annots.length, y/annots.length, z/annots.length];

	        let nx = annots.map(a => a.json_details.PCMeanNormal[0]).reduce((pv, cv) => pv + cv, 0);
	        let ny = annots.map(a => a.json_details.PCMeanNormal[1]).reduce((pv, cv) => pv + cv, 0);
	        let nz = annots.map(a => a.json_details.PCMeanNormal[2]).reduce((pv, cv) => pv + cv, 0);
	        normals[layers.ids[i]] = [nx/annots.length, ny/annots.length, nz/annots.length];

	        // if the layer contains a single annotation, we dont want the layer and the annotation to be superimposed
	        if (annots.length === 1){
	          positions[layers.ids[i]][0] -= 3;
	          positions[layers.ids[i]][1] -= 3;
	          positions[layers.ids[i]][2] -= 3;
	        }
	      }
	      result["positions"] = positions;
	      result["normals"] = normals;
	      console.log(result);
	      resolve(result);
	      //resolve(positions);
	    });
	    return promise;
	  }

	  /**
	  * This function allows to ...
	  * groups json
	  * layers json
	  */

	  static async computeGroupsPositions(groups, layers){
	    const promise = new Promise ((resolve) => {
	      let positions = [];
	      let normals = [];
	      let result = [];

	      for (const i in groups.ids){

	        //const lays = layers.layersData.filter(l => l.parent === groups.ids[i]).map(l => l.id);
	        //const positions = layers.layersData.filter(l => l.parent === groups.ids[i]).map(l => layers.positions[l.id]);
	        const layRs = layers.layersData.filter(l => l.parent === groups.ids[i]);
	        console.log(layRs);
	        let x = layRs.map(l => layers.positions[l.id][0]).reduce((pv, cv) => pv + cv, 0);
	        let y = layRs.map(l => layers.positions[l.id][1]).reduce((pv, cv) => pv + cv, 0);
	        let z = layRs.map(l => layers.positions[l.id][2]).reduce((pv, cv) => pv + cv, 0);
	        positions[groups.ids[i]] = [x/layRs.length, y/layRs.length, z/layRs.length];

	        let nx = layRs.map(l => layers.normals[l.id][0]).reduce((pv, cv) => pv + cv, 0);
	        let ny = layRs.map(l => layers.normals[l.id][1]).reduce((pv, cv) => pv + cv, 0);
	        let nz = layRs.map(l => layers.normals[l.id][2]).reduce((pv, cv) => pv + cv, 0);
	        normals[groups.ids[i]] = [nx/layRs.length, ny/layRs.length, nz/layRs.length];

	        // if the group contains a single layer, we dont want the group and the layer to be superimposed
	        if (layRs.length === 1){
	          positions[groups.ids[i]][0] -= 3;
	          positions[groups.ids[i]][1] -= 3;
	          positions[groups.ids[i]][2] -= 3;
	        }
	      }
	      result["positions"] = positions;
	      result["normals"] = normals;
	      console.log(result);
	      resolve(result);
	      //resolve(positions);
	    });
	    return promise;
	  }

	  static async computeMergedGroupsPositions(groups, layers){
	    const promise = new Promise ((resolve) => {
	      let positions = [];
	      let normals = [];
	      let result = [];
	      console.log(groups);
	      console.log(layers);

	      let calques = [];
	      let l = [];
	      let lay = [];

	      let keys = Object.keys(layers.layersData);
	      console.log(keys);

	      for(const i in keys){
	        let currentKey = keys[i];
	        console.log(currentKey);
	        l[currentKey] = layers.layersData[currentKey];
	        lay[currentKey] = l[currentKey].split('+');
	        console.log(lay[currentKey]);
	      }

	      console.log(l);
	      console.log(lay);



	      for(i=0;i<lay.id.length;i++){
	        let calque = [];
	        calque.id = lay.id[i];
	        calque.name = lay.name[i];
	        calque.owner = lay.owner[i];
	        calque.parent = lay.parent[i];
	        calque.project = lay.project[i];
	        calque.propagated = lay.propagated[i];
	        calque.type = lay.type[i];
	        if(lay.user_fields[i]){
	          calque.user_fields = lay.user_fields[i];
	        }

	        calque._id = lay._id[i];
	        calque._rev = lay._rev[i];

	        console.log(calque);
	        calques.push(calque);

	      }




	      /*
	      for(const i in keys){
	        let currentKey = keys[i];
	        console.log(currentKey);
	        l[currentKey] = layers.layersData[currentKey];
	        lay[currentKey] = l[currentKey].split('+');
	      }
	      console.log(l);
	      console.log(lay);

	      for(j=0;j<layers.ids.length;j++){
	        let calque = [];
	        for(const i in lay){
	          let x = lay[i][j];
	          console.log(x);
	          calque.push(x);

	        }
	        console.log(calque);
	        calques.push(calque);

	      }     */

	      console.log(calques);
	      layers.layersData = calques;
	      console.log(layers);



	      for (const i in groups.ids){
	        console.log(groups.ids[i]);

	        //const lays = layers.layersData.filter(l => l.parent === groups.ids[i]).map(l => l.id);
	        //const positions = layers.layersData.filter(l => l.parent === groups.ids[i]).map(l => layers.positions[l.id]);
	        console.log(layers.layersData);
	        const layRs = layers.layersData.filter(l => l.parent === groups.ids[i]);
	        console.log(layRs);


	        let x = layRs.map(l => layers.positions[l.id][0]).reduce((pv, cv) => pv + cv, 0);
	        let y = layRs.map(l => layers.positions[l.id][1]).reduce((pv, cv) => pv + cv, 0);
	        let z = layRs.map(l => layers.positions[l.id][2]).reduce((pv, cv) => pv + cv, 0);
	        positions[groups.ids[i]] = [x/layRs.length, y/layRs.length, z/layRs.length];

	        let nx = layRs.map(l => layers.normals[l.id][0]).reduce((pv, cv) => pv + cv, 0);
	        let ny = layRs.map(l => layers.normals[l.id][1]).reduce((pv, cv) => pv + cv, 0);
	        let nz = layRs.map(l => layers.normals[l.id][2]).reduce((pv, cv) => pv + cv, 0);
	        normals[groups.ids[i]] = [nx/layRs.length, ny/layRs.length, nz/layRs.length];

	        // if the group contains a single layer, we dont want the group and the layer to be superimposed
	        if (layRs.length === 1){
	          positions[groups.ids[i]][0] -= 3;
	          positions[groups.ids[i]][1] -= 3;
	          positions[groups.ids[i]][2] -= 3;
	        }
	      }
	      result["positions"] = positions;
	      result["normals"] = normals;
	      resolve(result);
	      console.log(result);
	      //resolve(positions);
	    });
	    return promise;
	  }

	  /**
	  * This function allows to...
	  * id annot ID
	  */

	  static async getDescription(annotData, layerData, projectData){
	    const promise = new Promise ((resolve) => {
	      console.log(annotData);
	      //let stringDescription = "";
	      let aioliURL = `${Potree.aioliPath}/public?id=` + annotData.project;
	      // let stringDescription = `<img src="${Potree.iconsPath}/aioli.png" class="annotation-action-icon" onclick="window.open('${aioliURL}', '_blank').focus();">  <b><u>${annotData.name}:</b></u><br/>`;
	      let stringDescription = `<b><u>${annotData.name}:</b></u><br/>`;
	      let isEmpty = true;
	      for (const key in annotData.user_data){
	        isEmpty = false;
	        const fieldType = layerData.user_fields[key].type;
	        const fieldName = layerData.user_fields[key].name;
	        const fieldValue = annotData.user_data[key];
	        // TODO CHECK IF THESAURUS TERM OR MEDIA OR JUST STRING
	        if(typeof fieldValue == 'object' && fieldValue !== null){
	          console.log(fieldValue);
	          for (const key in fieldValue) {
	            console.log(key, fieldValue[key]);
	            stringDescription += "<b>"+ key.toString() +":</b> "+ fieldValue[key] + "<br/>";
	          }
	        }
	        else {
	          stringDescription += "<b>"+ fieldName +":</b> "+ fieldValue + "<br/>";
	        }
	        //stringDescription += "<b>"+ fieldName +":</b> "+ fieldValue + "<br/>";
	      }

	      if(annotData.user_uploads){
	        for (const elem in annotData.user_uploads){
	          console.log(elem);
	          let upload = annotData.user_uploads[elem];
	          let uploadType = upload.type;
	          let uploadExtension = upload.extension;
	          console.log(projectData);

	          if(uploadType.includes("image")){
	            //console.log("IMAGE");
	            let path = Potree.aioliPath + "/workspace/usr/" + projectData.owner + "/projects/" + projectData.metadata.projectID + "/attachments/" + elem + "." + uploadExtension;
	            stringDescription += `<br/><img src="${path}" alt="${elem}" style="max-width:100%; object-fit:contain;">`;
	          }
	          else if(uploadType.includes("video")){
	            console.log("VIDEO");
	            let path = Potree.aioliPath + "/workspace/usr/" + projectData.owner + "/projects/" + projectData.metadata.projectID + "/attachments/" + elem + "." + uploadExtension;
	            stringDescription += `<br/><video src="${path}" type="${uploadType}" controls style="max-width:100%; object-fit:contain;">`;
	          }
	          else if(uploadType.includes("audio")){
	            console.log("AUDIO");
	            let path = Potree.aioliPath + "/workspace/usr/" + projectData.owner + "/projects/" + projectData.metadata.projectID + "/attachments/" + elem + "." + uploadExtension;
	            stringDescription += `<br/><audio src="${path}" type="${uploadType}" controls style="max-width:100%; object-fit:contain;">`;
	          }
	          else {
	            console.log("TYPE DE FICHIER NON PRIS EN CHARGE");
	          }
	        }
	      }

	      // if (stringDescription === ""){
	      if (isEmpty){
	        stringDescription = "No description available";
	      }
	      stringDescription += `<pre id="json-viewer">Load detailed info on annotation<button id="loadJson">Load</button></pre>`;

	      resolve(stringDescription);
	    });
	    return promise;
	  }

	  static async getMergedDescription(annotData, layerData, projectData){
	    const promise = new Promise ((resolve) => {
	      //let stringDescription = "";
	      let aioliURL = `${Potree.aioliPath}/public?id=` + annotData.project;
	      let stringDescription = `<img src="${Potree.iconsPath}/aioli.png" class="annotation-action-icon" onclick="window.open('${aioliURL}', '_blank').focus();">  <b><u>${annotData.name}:</b></u><br/>`;
	      let isEmpty = true;
	      for (const key in annotData.user_data){
	        isEmpty = false;
	        const fieldType = layerData.user_fields[key].type;
	        const fieldName = layerData.user_fields[key].name;
	        const fieldValue = annotData.user_data[key];
	        // TODO CHECK IF THESAURUS TERM OR MEDIA OR JUST STRING
	        if(typeof fieldValue == 'object' && fieldValue !== null){
	          console.log(fieldValue);
	          for (const key in fieldValue) {
	            console.log(key, fieldValue[key]);
	            stringDescription += "<b>"+ key.toString() +":</b> "+ fieldValue[key] + "<br/>";
	          }
	        }
	        else {
	          stringDescription += "<b>"+ fieldName +":</b> "+ fieldValue + "<br/>";
	        }
	        //stringDescription += "<b>"+ fieldName +":</b> "+ fieldValue + "<br/>";
	      }

	      for(i=0;i<projectData.id.length;i++){
	        if(annotData.user_uploads && annotData.project === projectData.id[i]){
	          for (const elem in annotData.user_uploads){
	            console.log(elem);
	            let upload = annotData.user_uploads[elem];
	            let uploadType = upload.type;
	            let uploadExtension = upload.extension;
	            console.log(projectData);

	            if(uploadType.includes("image")){
	              //console.log("IMAGE");
	              let path = Potree.aioliPath + "/workspace/usr/" + projectData.owner[i] + "/projects/" + projectData.metadata[i].projectID + "/attachments/" + elem + "." + uploadExtension;
	              stringDescription += `<br/><img src="${path}" alt="${elem}" style="max-width:100%; object-fit:contain;">`;
	            }
	            else if(uploadType.includes("video")){
	              console.log("VIDEO");
	              let path = Potree.aioliPath + "/workspace/usr/" + projectData.owner[i] + "/projects/" + projectData.metadata[i].projectID + "/attachments/" + elem + "." + uploadExtension;
	              stringDescription += `<br/><video src="${path}" type="${uploadType}" controls style="max-width:100%; object-fit:contain;">`;
	            }
	            else if(uploadType.includes("audio")){
	              console.log("AUDIO");
	              let path = Potree.aioliPath + "/workspace/usr/" + projectData.owner[i] + "/projects/" + projectData.metadata[i].projectID + "/attachments/" + elem + "." + uploadExtension;
	              stringDescription += `<br/><audio src="${path}" type="${uploadType}" controls style="max-width:100%; object-fit:contain;">`;
	            }
	            else {
	              console.log("TYPE DE FICHIER NON PRIS EN CHARGE");
	            }
	          }
	        }
	      }



	      //if (stringDescription === ""){
	      if (isEmpty){
	        stringDescription = "No description available";
	      }

	      resolve(stringDescription);
	    });
	    return promise;
	  }

	  /**
	  * Calls all the needed functions to load an Aioli public project in the viewer
	  * id (project ID)
	  */
	  static async load(id, viewer, callback){

	    console.log(id);

	    // 1. Get the global datas about the project
	    let projectData = await AioliLoader.loadProjectData(id);
	    console.log(projectData);

	    // 2. Thanks to 1, get data related to the groups included in the project
	    let groupsData = await AioliLoader.getGroups(id);

	    let groups = {
	      groupsData: groupsData,
	      ids: Object.values(groupsData).map(g => g.id),
	      positions: []
	    };

	    console.log(groups);

	    // 3. Thanks to 2, get data related to the layers included in each groups
	    let layersData = [];
	    for (const i in groups.ids){
	      let layerData = await AioliLoader.getLayers(groups.ids[i]);
	      layersData = layersData.concat(Object.values(layerData));
	    }

	    let layers = {
	      layersData: layersData,
	      ids: Object.values(layersData).map(l => l.id),
	      positions: []
	    };

	    console.log(layers);

	    // 4. Thanks to 3, get data related to the annotations included in each layer
	    let annotationsData = [];
	    for (const i in layers.ids){
	      let annotationData = await AioliLoader.getAnnotations(layers.ids[i]);
	      //annotationsData = annotationsData.concat(Object.values(annotationData));

	      // we have to prevent an error if the layer contains no annotation
	      if(!annotationData){
	        console.log("The layer " + layers.ids[i] + " is empty");
	      }
	      else {
	        annotationsData = annotationsData.concat(Object.values(annotationData));
	      }
	    }


	    let couchTraces = await $.getJSON("https://absinthe.aioli.map.cnrs.fr/couch/traces/_all_docs?include_docs=true");
	    console.log(couchTraces);
	    let couchId = [];




	    let annotations = {
	      annotationsData: annotationsData,
	      ids: Object.values(annotationsData).map(a => a.id)
	    };
	    console.log(annotations.annotationsData);
	    console.log(id);
	    for(var i in annotations.annotationsData){
	      // annotations.annotationsData[i].trace = [];
	      for(var j in couchTraces.rows){
	        if(couchTraces.rows[j].doc.region === annotations.annotationsData[i].id){
	          annotations.annotationsData[i].couchId = couchTraces.rows[j].id;
	        }
	      };

	      console.log(annotations.annotationsData[i].couchId);
	      /*let traceUrl = "https://absinthe.aioli.map.cnrs.fr/couch/traces/" + annotations.annotationsData[i].couchId;
	      console.log(traceUrl)
	      let jsonTrace = await $.getJSON(traceUrl);
	      console.log(jsonTrace);
	      annotations.annotationsData[i].trace=jsonTrace;*/
	    }
	    console.log(annotations.annotationsData);
	    for(var i in annotations.annotationsData){
	      let traceUrl = "https://absinthe.aioli.map.cnrs.fr/couch/traces/" + annotations.annotationsData[i].couchId;
	      console.log(traceUrl);
	      let jsonTrace = await $.getJSON(traceUrl);
	      console.log(jsonTrace);
	      annotations.annotationsData[i].trace=jsonTrace;
	      annotations.annotationsData[i].imgPath="https://absinthe.aioli.map.cnrs.fr/workspace/usr/" + projectData.owner + "/projects/" + id +"/chantier/Images/" + jsonTrace.selection;
	    }
	    console.log(annotations.annotationsData);

	    // 5. From annotations barycenter positions, compute each layer position (mean pos)
	    //let layersPositions = await AioliLoader.computeLayersPositions(layers, annotations);
	    let layersPosData = await AioliLoader.computeLayersPositions(layers, annotations);
	    let layersPositions = layersPosData["positions"];
	    let layersNormals = layersPosData["normals"];

	    layers.positions = layersPositions;
	    layers.normals = layersNormals;

	    // 6. From layer positions, compute group position (mean pos)
	    //let groupsPositions = await AioliLoader.computeGroupsPositions(groups, layers);
	    let groupsPosData = await AioliLoader.computeGroupsPositions(groups, layers);
	    let groupsPositions = groupsPosData["positions"];
	    let groupsNormals = groupsPosData["normals"];

	    groups.positions = groupsPositions;
	    groups.normals = groupsNormals;

	    // et maintenant qu'on a tout ça il va falloir préparer les annotations en tenant compte de leur hiérarchie
	    const aioliURL = `${Potree.aioliPath}/public?id=` + id;
	    const projectGroups = [];

	    let  project = {
	      id: id,
	      pointcloud: null,
	      images: null,
	      traces: [],
	      groups: projectGroups,
	      name: projectData.name,
	      owner: projectData.owner,
	      metadata: projectData.metadata
	    };

	    for (const g in groups.groupsData){
	      const pos = groups.positions[groups.groupsData[g].id];

	      // on essaye d'arranger la position de la camera en fonction de la moyenne des normales des calques du groupe
	      let groupNormalView = new Object3D();
	      let groupMeanNormal = new Vector3(groups.normals[groups.groupsData[g].id][0], groups.normals[groups.groupsData[g].id][1], groups.normals[groups.groupsData[g].id][2]);
	      groupNormalView.position.set(pos[0], pos[1], pos[2]);
	      groupNormalView.translateOnAxis(groupMeanNormal, 10);
	      groupNormalView.updateMatrixWorld();

	      let gr = new Potree.Annotation({
	        title: groups.groupsData[g].name,
	        position: pos,
	        //cameraPosition: [pos[0] - 10, pos[1] - 10, pos[2] - 3],
	        cameraPosition: [groupNormalView.position.x, groupNormalView.position.y, groupNormalView.position.z],
	        cameraTarget: groups.positions[groups.groupsData[g].id],
	        aioli: "descriptions_" + id,
	        tId: groups.groupsData[g].id,
	        infos: groups.groupsData[g],
	        description: `<pre id="json-viewer">Load detailed info on group<button id="loadJson">Load</button></pre>`
	      });


	      const lays = layers.layersData.filter(l => l.parent === groups.ids[g]);
	      for (const l in lays){
	        const lpos = layers.positions[lays[l].id];

	        // on essaye d'arranger la position de la camera en fonction de la moyenne des normales des régions du calque
	        let layerNormalView = new Object3D();
	        let layerMeanNormal = new Vector3(layers.normals[lays[l].id][0], layers.normals[lays[l].id][1], layers.normals[lays[l].id][2]);
	        layerNormalView.position.set(lpos[0], lpos[1], lpos[2]);
	        layerNormalView.translateOnAxis(layerMeanNormal, 3.5);
	        layerNormalView.updateMatrixWorld();

	        console.log(lays[l]);

	        let la = new Potree.Annotation({
	          title: lays[l].name,
	          position: lpos,
	          //cameraPosition: [lpos[0] - 3, lpos[1] - 3, lpos[2] - 3],
	          cameraPosition: [layerNormalView.position.x, layerNormalView.position.y, layerNormalView.position.z],
	          cameraTarget: lpos,
	          aioli: "group_"+groups.groupsData[g].id,
	          tId: "layer_"+lays[l].id,
	          infos: lays[l],
	          description: `<pre id="json-viewer">Load detailed info on layer<button id="loadJson">Load</button></pre>`
	        });

	        const annots = annotations.annotationsData.filter(a => a.parent === lays[l].id);
	        for (const a in annots){
	          console.log(annots[a]);
	          const apos = [parseFloat(annots[a].json_details.PCBarycenter[0]),parseFloat(annots[a].json_details.PCBarycenter[1]),parseFloat(annots[a].json_details.PCBarycenter[2])];//annotations.positions[annots[a].id];

	          // on essaye d'arranger la position de la camera en fonction de la moyenne des normales de la région
	          let normalView = new Object3D();
	          normalView.position.set(apos[0], apos[1], apos[2]);
	          const meanNormal = new Vector3(parseFloat(annots[a].json_details.PCMeanNormal[0]),parseFloat(annots[a].json_details.PCMeanNormal[1]),parseFloat(annots[a].json_details.PCMeanNormal[2])).normalize();
	          normalView.translateOnAxis(meanNormal, 2);
	          normalView.updateMatrixWorld();

	          let tracePts = [];
	          for(i=0;i<annots[a].trace.ptctrl.length;i++){
	            console.log(annots[a].trace.ptctrl[i]);
	            let vertice = new Vector3(annots[a].trace.ptctrl[i].x-0.5, annots[a].trace.ptctrl[i].y-0.5, 2);
	            console.log(vertice);
	            tracePts.push(vertice);
	          }

	          let traceShape = new Shape( tracePts );

	          console.log(traceShape);

	          let geometry = new ShapeGeometry( traceShape );



	          console.log(annots[a].material);

	          let color = annots[a].material;

	          let traceColor;
	          switch (color){
	            case "red":
	              traceColor = new Color().setRGB(163/255, 35/255, 57/255);
	              break;s;
	            case "orange":
	              traceColor = new Color().setRGB(173/255, 107/255, 43/255);
	              break;
	            case "blue":
	              traceColor = new Color().setRGB(29/255, 66/255, 146/255);
	              break;
	            case "cyan":
	              traceColor = new Color().setRGB(86/255, 184/255, 191/255);
	              break;
	            case "green":
	              traceColor = new Color().setRGB(31/255, 124/255, 46/255);
	              break;
	            case "lime":
	              traceColor = new Color().setRGB(116/255, 206/255, 55/255);
	              break;
	            case "yellow":
	              traceColor = new Color().setRGB(204/255, 205/255, 63/255);
	              break;
	            case "purple":
	              traceColor = new Color().setRGB(96/255, 41/255, 175/255);
	              break;
	            case "gray":
	              traceColor = new Color().setRGB(87/255, 90/255, 91/255);
	              break;
	            default:
	              //console.log(color);
	              //console.log(annots[a]);
	              traceColor = new Color().setRGB(163, 35, 57);


	              break;
	          }

	          console.log(traceColor);

	          let material = new MeshBasicMaterial( { color: traceColor, opacity: 0.5, transparent: true} );

	          console.log(material);

	          let mesh = new Mesh( geometry, material );

	          console.log(mesh);

	          mesh.visible=false;

	          let an = new Potree.Annotation({
	            title: annots[a].name,
	            position: apos,
	            //cameraPosition: [apos[0] - 1, apos[1] - 1, apos[2] - 1],
	            cameraPosition: [normalView.position.x, normalView.position.y, normalView.position.z],
	            cameraTarget: apos,
	            aioli: annots[a].id,
	            tId: "annotation_"+annots[a].id,
	            trace : annots[a].trace,
	            polygon: mesh,
	            imgPath : annots[a].imgPath,
	            /*
	            actions: [{
	              icon: `${Potree.iconsPath}/aioli.png`,
	              onclick: function(){
	                var win = window.open(aioliURL, '_blank');
	                win.focus();
	              }
	            }],*/
	            description: await AioliLoader.getDescription(annots[a], lays[l], projectData), // TODO: get description (WITH additionnal MEDIAS !)
	            json : annots[a]

	          });
	          console.log(an);

	          la.add(an);
	          // dispatch Event to create node

	          let annotCloudPath = Potree.aioliPath + "/workspace/usr/" + projectData.owner + "/projects/" + id + "/chantier/clouds/" + annots[a].id + "/resources/pointclouds/webcloud/cloud.js";
	          Potree.POCLoader.load(annotCloudPath, function(geometry){
	            if (!geometry) {
	              console.error(new Error(`failed to load point cloud from URL: ${projectData.densecloudPath}`));
	            }
	            else {
	              let annotCloud = new Potree.PointCloudOctree(geometry);
	              annotCloud.aioli = id;
	              annotCloud.name = annots[a].id;
	              //annotCloud.visible = true;
	              //annotCloud.visible = la.visible;

	              let color = annots[a].material;
	              switch (color){
	                case "red":
	                  annotCloud.material.activeAttributeName = "composite";//"color";
	                  annotCloud.material.color = new Color().setRGB(163/255, 35/255, 57/255);
	                  annotCloud.material.weightColor = 0.75;
	                  break;
	                case "orange":
	                  annotCloud.material.activeAttributeName = "composite";//"composite";
	                  annotCloud.material.color = new Color().setRGB(173/255, 107/255, 43/255);
	                  annotCloud.material.weightColor = 0.75;
	                  break;
	                case "blue":
	                  annotCloud.material.activeAttributeName = "composite";//"composite";
	                  annotCloud.material.color = new Color().setRGB(29/255, 66/255, 146/255);
	                  annotCloud.material.weightColor = 0.75;
	                  break;
	                case "cyan":
	                  annotCloud.material.activeAttributeName = "composite";//"composite";
	                  annotCloud.material.color = new Color().setRGB(86/255, 184/255, 191/255);
	                  annotCloud.material.weightColor = 0.75;
	                  break;
	                case "green":
	                  annotCloud.material.activeAttributeName = "composite";//"composite";
	                  annotCloud.material.color = new Color().setRGB(31/255, 124/255, 46/255);
	                  annotCloud.material.weightColor = 0.75;
	                  break;
	                case "lime":
	                  annotCloud.material.activeAttributeName = "composite";//"composite";
	                  annotCloud.material.color = new Color().setRGB(116/255, 206/255, 55/255);
	                  annotCloud.material.weightColor = 0.75;
	                  break;
	                case "yellow":
	                  annotCloud.material.activeAttributeName = "composite";//"composite";
	                  annotCloud.material.color = new Color().setRGB(204/255, 205/255, 63/255);
	                  annotCloud.material.weightColor = 0.75;
	                  break;
	                case "purple":
	                  annotCloud.material.activeAttributeName = "composite";//"composite";
	                  annotCloud.material.color = new Color().setRGB(96/255, 41/255, 175/255);
	                  annotCloud.material.weightColor = 0.75;
	                  break;
	                case "gray":
	                  annotCloud.material.activeAttributeName = "composite";//"composite";
	                  annotCloud.material.color = new Color().setRGB(87/255, 90/255, 91/255);
	                  annotCloud.material.weightColor = 0.75;
	                  break;
	                default:
	                  //console.log(color);
	                  //console.log(annots[a]);
	                  annotCloud.material.activeAttributeName = "composite";//"color";
	                  annotCloud.material.color = new Color().setRGB(163/255, 35/255, 57/255);
	                  annotCloud.material.weightColor = 0.75;

	                  break;
	              }
	              annotCloud.material.size = 3;
	              an.cloud = annotCloud;
	              //console.log(annots[a].material);





/////////////////
//
// CHARGEMENT DES NUAGES DES POINTS DES ANNOTATIONS
//
/////////

	              viewer.scene.addAioliAnnotationCloud(project, an.cloud, an);

////////////////////////////////////////////////

	              //viewer.scene.addTrace(project, an.polygon, an)
	              callback({type: 'aioli_annotation_loaded', project: project});
	            }
	          });

	          Potree.TraceLoader.load(projectData.calibInternePath, projectData.calibExternePath, viewer, annots[a].id, "aioli", "null", projectData.imagesPath, an).then(trace => {
	            console.log(trace);
	            project.traces.push(trace);

	          });
	        }

	        gr.add(la);
	        // dispatch Event to create node
	      }
	      projectGroups.push(gr);
	      //viewer.scene.annotations.add(gr);
	      // dispatch Event to create node
	    }

	    // Charge le dense cloud et les images orientées du projet
	    if(projectData.densecloudPath.indexOf('cloud.js') > 0){
	      Potree.POCLoader.load(projectData.densecloudPath, function (geometry) {
	        if (!geometry) {
	          console.error(new Error(`failed to load point cloud from URL: ${projectData.densecloudPath}`));
	        }
	        else {
	          console.log(geometry);
	          console.log(project);
	          project.pointcloud = new Potree.PointCloudOctree(geometry);
	          console.log(project.pointcloud);
	          project.pointcloud.visible = true;
	          Potree.OrientedImageLoader.load(projectData.calibInternePath, projectData.calibExternePath, viewer, id, "aioli", "null", projectData.imagesPath).then(images => {
	            console.log(images);

	            // images.node.visible = false;
	            project.images = images;
	            project.images.visible = false;
	            console.log(project.images);
	            project.pointcloud.material.activeAttributeName = "color";
	            project.pointcloud.material.color.setHex(0x464646);
	            project.pointcloud.material.size = 0.01;
	            project.pointcloud.material.opacity = 0.30;


	            viewer.scene.addAioliProject(project);
	            callback({type: 'aioli_loaded', project: project});
	          });
	        }
	      });
	    }


	    console.log(project);

	    return project;
	  }


	};
