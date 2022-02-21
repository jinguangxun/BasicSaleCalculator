var products = []; //Global variable which contains all items in transaction window

//Function for pressing product buttons
function productButton(name,group,price,tax) {
  let flag = 0; //Flag of if this product already exists; 0 -> no, 1 -> yes

  //Check if the product already exists in the transaction
  for (let i = 0; i < products.length; i++){
  	if (products[i][0] === name){
  		flag = 1;
  		products[i][4] = products[i][4] + 1; //If exists, quantity plus one
  	}
  }

  //When this is newly added product
  if (flag == 0){
  	if (products.length < 10){
  	  let product = [name, group, price, tax, 1];  //The fifth "1" is the quantity of this product
  	  products.push(product); 
  	} else {
  		alert("Sorry, can not have more than 10 different products.");
  	}
  }
  
  displayScreen();
}

//Function for the void/cancel button
function cancelAll(){
	products = [];  //Set everything to null
	displayScreen();
}

//Function for display the information in the transaction window
function displayScreen(){
	if (!!products[0]){ //When the transaction window isn't empty
		let displayInfo = ''; //All product information
		let subtotal = 0;
		let tax = 0;
		let total = 0;

		//Organize information, round up all numbers to two decimal places
		for (let i = 0; i < products.length; i++){
			displayInfo = displayInfo + '<p>' + products[i][0] + ', Price/Unit:' + products[i][2] + ' CAD, Qty:' + products[i][4] + '</p>';
			subtotal = Math.round((subtotal + products[i][2] * products[i][4]) * 100) / 100;
			if (products[i][3] == 1){
				tax = Math.round((tax + products[i][2] * products[i][4] * 0.1) * 100) / 100;
			}
			total = Math.round((subtotal + tax) * 100) / 100;
		}

		//Replace text information
		document.getElementById('transaction').innerHTML = displayInfo;
		document.getElementById('subtotal').textContent = 'Subtotal: ' + subtotal + ' CAD';
		document.getElementById('tax').textContent = 'Tax: ' + tax + ' CAD';
		document.getElementById('total').textContent = 'Total: ' + total + ' CAD';
	} else { //When the transaction window is empty
		document.getElementById('transaction').textContent = '';
		document.getElementById('subtotal').textContent = 'Subtotal: ';
		document.getElementById('tax').textContent = 'Tax: ';
		document.getElementById('total').textContent = 'Total: ';
	}
}

//Function for save/export button
//I added a little bit extra that it not only saves the information as JSON file and download it,
//it also will create a new tab with related information for easy look
function printResult() {
	if (!!products[0]){ //When the transaction window isn't empty
		let displayInfo = '<br><center>Transaction</center><br>'; //Content which will be displayed on new tab
		let subtotal = 0;
		let tax = 0;
		let total = 0;

		//Organize information
		for (let i = 0; i < products.length; i++){
			displayInfo = displayInfo + '<center><p>' + products[i][0] + '/' + products[i][1] + ', Price/Unit:' + products[i][2] + ' CAD, Qty:' + products[i][4] + '</p></center>';
			subtotal = Math.round((subtotal + products[i][2] * products[i][4]) * 100) / 100;
			if (products[i][3] == 1){
				tax = Math.round((tax + products[i][2] * products[i][4] * 0.1) * 100) / 100;
			}
			total = Math.round((subtotal + tax) * 100) / 100;
		}

		displayInfo = displayInfo + '<br><center><p>Subtotal: ' + subtotal + ' CAD</p></center>' + 
		'<center><p>Tax: ' + tax + ' CAD</p></center>' + 
		'<center><p>Total: ' + total + ' CAD</p></center>';

		let transaction = []; //Content for JSON file
		
		//Organize to JSON file format
		for (let i = 0; i < products.length; i++){
			let product = {};
			product["name"] = products[i][0];
			product["group"] = products[i][1];
			product["price"] = products[i][2]+"";
			if (products[i][3] == 0) {
				product["tax"] = "no";
			} else {
				product["tax"] = "yes";
			}
			product["quantity"] = products[i][4]+"";
			transaction.push(product);
		}

		let result = {};
		result["subtotal"] = subtotal + "";
		result["tax"] = tax + "";
		result["total"] = total + "";

		transaction.push(result);
		let jsonFile = JSON.stringify(transaction, null, 2);

		//Download the JSON file
		let link = document.createElement('a');
		link.download = 'save.json';
		let blob = new Blob([jsonFile], {type: 'text/plain'});
		link.href = URL.createObjectURL(blob);
		link.click();
		URL.revokeObjectURL(link.href);

		//Set information to new tab
		let receipt = window.open();
		receipt.document.title = 'Receipt';
		receipt.document.body.style.fontFamily = 'arial';
		receipt.document.body.style.width = '400px';
		receipt.document.body.innerHTML = displayInfo;

	} else {
		//When the transaction window is empty
		alert("Transaction is empty, can not save transaction.");
	}
}
