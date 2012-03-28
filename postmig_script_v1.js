 nullifyIDs();
 addClusterScript();
 removeDuplicates();
 
 function nullifyIDs() 
 {
  var sys_trigger = new GlideRecord('sys_trigger'); 
  sys_trigger.query(); 
  while(sys_trigger.next()) 
  { 
   if(sys_trigger.system_id != "") 
   { 
     sys_trigger.system_id = ""; 
     sys_trigger.update();
   }
  }
  gs.log("Successfully nullified system_id's.");
 }

 function addClusterScript() 
 {
  var sys_trigger = new GlideRecord('sys_trigger'); 
  sys_trigger.query(); 
  while(sys_trigger.next()) 
  { 
   if(sys_trigger.name == "Clean logs" || sys_trigger.name == "Clean Temp Files" || "System - reduce resources" ) 
   { 
     sys_trigger.job_context += "\n fcClusterScript=true"; 
     sys_trigger.update();
   }
  }
  gs.log("Successfully added 'fcClusterScript=true'.");
 }
 
 function removeDuplicates() 
 {
  var cleanlogscount = 0; 
  var cleantempcount = 0; 
  var reducecount = 0; 
  var sys_trigger = new GlideRecord('sys_trigger');
 
  sys_trigger.query(); 

  while(sys_trigger.next()){ 
	if(sys_trigger.name == "Clean logs")
	{
		cleanlogscount++;	 
	}
	if(sys_trigger.name == "Clean Temp Files")
	{
		cleantempcount++;	 
	}
	if(sys_trigger.name == "System - reduce resources")
	{
		reducecount++;	 
	}
  }

  if(cleanlogscount + cleantempcount + reducecount > 3)
  {
  	if(cleanlogscount > 1) 
  	{
  		gs.log("WARNING: Duplicate Clean logs found."); 
  		//delete the duplicate records. 
  		var rec = new GlideRecord('sys_trigger');
		var k=0;
		rec.addQuery('name','Clean logs');
		rec.query();
		while (rec.next()) 
		{ 
			k++;
			if(k>1)
			{
 				rec.deleteRecord();
 				gs.print('Duplicate record ' + rec.name + ' successfully deleted.');
 			}
		}
    }
  	if(cleantempcount > 1) 
  	{
  		gs.log("WARNING: Duplicate Clean Temp Files found.");
  		//delete the duplicate records. 
  		var rec = new GlideRecord('sys_trigger');
		var k=0;
		rec.addQuery('name','Clean Temp Files');
		rec.query();
		while (rec.next()) 
		{ 
			k++;
			if(k>1)
			{
 				rec.deleteRecord();
 				gs.print('Duplicate record ' + rec.name + ' successfully deleted.');
 			}
		}
    }
  	if(reducecount > 1) 
  	{
  	gs.log("WARNING: Duplicate System - reduce resources found.");
  		//delete the duplicate records. 
  		var rec = new GlideRecord('sys_trigger');
		var k=0;
		rec.addQuery('name','System - reduce resources');
		rec.query();
		while (rec.next()) 
		{ 
			k++;
			if(k>1)
			{
 				rec.deleteRecord();
 				gs.print('Duplicate record ' + rec.name + ' successfully deleted.');
 			}
		}
    }  	
  }
  else
  {
	gs.log("Successfully checked for duplicates. None found. Proceed."); 
  }
 }