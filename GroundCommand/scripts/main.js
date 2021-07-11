var _selectedArmy = 'UNSC';
var _hasCommander = false;
var _uniqueIdentifier = 0;
var _unitIdentifier = 0;
var _currentBRInf = 0;
var _currentBRArm = 0;
var _currentBRFly = 0;
var _currentPoints = 0;

var _UNSC_Unit_Options = [];
var _Cov_Unit_Options = [];

var _Current_Army_Options = [];

var _ArmyComp = [];

var Unit = function(id, name, cost, buildRating, unitType, image) {
	this.id = id;
	this.name = name;
	this.cost = cost;
	this.buildRating = buildRating;
	this.unitType = unitType;
	this.image = image;
}

var UnitGroup = function(id, total) {
	this.id = id;
	this.total = total;
}

function init() {
	for (x in UNSC_Units) {
		_UNSC_Unit_Options.push(new Unit(x, UNSC_Units[x].name, UNSC_Units[x].cost, UNSC_Units[x].buildRating, UNSC_Units[x].type, UNSC_Units[x].icon));
	}		

	for (x in Covenant_Units) {
		_Cov_Unit_Options.push(new Unit(x, Covenant_Units[x].name, Covenant_Units[x].cost, Covenant_Units[x].buildRating, Covenant_Units[x].type, Covenant_Units[x].icon));
	}
	
	addListeners();				
}

function addListeners() {	
	$('body').on('click', '.list-icon', function() {
		displayUnits($(this).attr('data-type'));
	});
	
	$('body').on('click', '.unit-card-close', function() {
		$('#unitCardContainer').html('');
		$('.item-container').removeClass('active');
	});
	
	$('body').on('click', '.add-unit-button', function() {
		addUnit($(this).attr('data-type'));
	});
	
	$('body').on('click', '.add-unit-small', function() {
		addUnit($(this).attr('data-id'));
	});
	
	$('body').on('click', '.remove-unit-button', function() {
		removeUnit($(this).attr('data-id'));
	});
	
	$('body').on('click', '.faction-button', function() {
		$('#unitCardContainer').html('');
		$('#builtList').html('');
		$('#commanderButton').removeClass('active');
		_hasCommander = false;
		
		_currentBRInf = 0;
		_currentBRArm = 0;
		_currentBRFly = 0;
		_currentPoints = 0;
		
		drawPoints();
		
		if (_selectedArmy == 'Covenant') {
			_selectedArmy = 'UNSC';
			$(this).html('<p>UNSC</p>');
		} else {
			_selectedArmy = 'Covenant';
			$(this).html('<p>Covenant</p>');
		}
	});
}

function displayUnits(n) {
	$('.item-container').addClass('active');
	$('#unitCardContainer').html('');
	
	if (n == 'C') {
		toggleCommander();
	} else {
		switch(_selectedArmy) {
			case 'UNSC':
				_Current_Army_Options = _UNSC_Unit_Options;
				break;
			case 'Covenant':
				_Current_Army_Options = _Cov_Unit_Options;
				break;
		}
	}
	
	for (x in _Current_Army_Options) {
		if (_Current_Army_Options[x].unitType == n) {
			jQuery('<div/>', {
				'class': 'unit-card ' + _Current_Army_Options[x].image + '-image',
				'data-id': x,
				'data-type': _Current_Army_Options[x].id
			}).appendTo('#unitCardContainer');
			
			jQuery('<div/>', {
				'class': 'unit-control-bar',
				'data-id': x,
				'html': '<div class="control-bar-text"><div class="unit-card-name"><p>' + _Current_Army_Options[x].name + '</p></div><p>Cost: ' + _Current_Army_Options[x].cost + '</p><p>Build Rating: ' + _Current_Army_Options[x].buildRating + '</p></div>'
			}).appendTo('.unit-card[data-id="' + x + '"]');
			
			jQuery('<div/>', {
				'class': 'add-unit-button flex-item',
				'html': '<p>+</p>',
				'data-type': _Current_Army_Options[x].id,
			}).appendTo('.unit-control-bar[data-id="' + x + '"]');
		}
	}
	
}

function toggleCommander() {
	if (_hasCommander == true) {
		$('#commanderButton').removeClass('active');
		_hasCommander = false;
	} else {
		$('#commanderButton').addClass('active');
		_hasCommander = true;
	}
	
	$('.item-container').removeClass('active');
	drawPoints();
}

function addUnit(n) {	
	var foundObject = false;
	
	if (_ArmyComp.length <= 0) {
		_ArmyComp.push(new UnitGroup(_Current_Army_Options[n].id, 1));
	} else {		
		for (x in _ArmyComp) {
			if (_ArmyComp[x].id == _Current_Army_Options[n].id) {
				foundObject = true;
				_ArmyComp[x].total += 1;
			}
		}
		if (foundObject == false) {
			_ArmyComp.push(new UnitGroup(_Current_Army_Options[n].id, 1));
		}
	}
	
	drawPoints();
	drawUnits();
}

function removeUnit(n) {
	for (x in _ArmyComp) {
		if (_ArmyComp[x].id == n) {
			_ArmyComp[x].total -= 1;
			if (_ArmyComp[x].total <= 0) {
				_ArmyComp.splice(x, 1);
			}
		}
	}	
	drawUnits();
	drawPoints();
}			

function drawPoints() {
	_currentBRInf = 0;
	_currentBRArm = 0;
	_currentBRFly = 0;
	_currentPoints = 0;
	
	if (_hasCommander == true) {
		_currentPoints = 50;
	}	
	
	for (x in _ArmyComp) {
		var unitInfo = _Current_Army_Options[_ArmyComp[x].id];
		switch (unitInfo.unitType) {
			case 'I':
				_currentBRInf += (unitInfo.buildRating * _ArmyComp[x].total);
				break;
			case 'A':
				_currentBRArm += (unitInfo.buildRating * _ArmyComp[x].total);
				break;
			case 'F':
				_currentBRFly += (unitInfo.buildRating * _ArmyComp[x].total);
				break;
		}
		_currentPoints += unitInfo.cost * _ArmyComp[x].total;
	}
	
	$('#totalBuildRatingInf').html(_currentBRInf);
	$('#totalBuildRatingArm').html(_currentBRArm);
	$('#totalBuildRatingFly').html(_currentBRFly);
	$('#currentPoints').html(_currentPoints);
}

function drawUnits() {
	$('#builtList').html(''); // Clear out drawn list
	
	for (x in _ArmyComp) {
		var n = _ArmyComp[x].id;
		jQuery('<div/>', {
			'class':'added-unit flex-item',
			'data-id': n,
			/*'data-br-value': _Current_Army_Options[n].buildRating,
			'data-br-type': _Current_Army_Options[n].unitType,
			'data-point-value': _Current_Army_Options[n].cost,*/
			'style': 'order: ' + _Current_Army_Options[n].id + ';'
		}).appendTo('#builtList');
		
		jQuery('<div/>', {
			'class':'top-row row flex-item',
			'html':'<p class="unit-name">' + _Current_Army_Options[n].name + ' (' + _ArmyComp[x].total + ')</p>',
		}).appendTo('.added-unit:last-child');
		
		jQuery('<div/>', {
			'class':'bottom-row row flex-item',
			'html':'<p class="unit-build-rating">BR: ' + (_Current_Army_Options[n].buildRating * _ArmyComp[x].total) + ' (' + _Current_Army_Options[n].buildRating + ')</p><p class="unit-cost">Cost: ' + (_Current_Army_Options[n].cost * _ArmyComp[x].total) + ' (' + _Current_Army_Options[n].cost + ')</p>'
		}).appendTo('.added-unit:last-child');
		
		jQuery('<div/>', {
			'class':'add-unit-small',
			'text':'+1',
			'data-id': n
		}).appendTo('.added-unit:last-child');
		
		jQuery('<div/>', {
			'class':'remove-unit-button',
			'text':'-1',
			'data-id': n
		}).appendTo('.added-unit:last-child');		
	}	
}