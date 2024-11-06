import React, { useState, useEffect } from 'react';
import { MdDarkMode, MdLightMode } from 'react-icons/md';
import './App.css';
import { translations } from './translations';

const App = () => {
  const [numberOfPeople, setNumberOfPeople] = useState(2);
  const [currentScreen, setCurrentScreen] = useState('people');
  const [foodItems, setFoodItems] = useState([]);
  const [hasServiceCharge, setHasServiceCharge] = useState(false);
  const [language, setLanguage] = useState('en');
  const t = translations[language];

  const [currentFood, setCurrentFood] = useState({
    name: `${t.food} 1`,
    price: '',
    sharedBy: []
  });

  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark-theme', isDarkTheme);
  }, [isDarkTheme]);

  const ThemeToggle = () => (
    <button 
      className="theme-toggle"
      onClick={() => setIsDarkTheme(!isDarkTheme)}
      aria-label="Toggle dark mode"
    >
      {isDarkTheme ? <MdLightMode className="theme-icon" /> : <MdDarkMode className="theme-icon" />}
    </button>
  );

  useEffect(() => {
    setCurrentFood(prev => ({
      ...prev,
      name: `${t.food} ${foodItems.length + 1}`
    }));
  }, [language, t.food, foodItems.length]);

  const LanguageSelector = () => (
    <div className="language-selector">
      <button 
        className={`lang-button ${language === 'en' ? 'active' : ''}`}
        onClick={() => setLanguage('en')}
      >
        EN
      </button>
      <button 
        className={`lang-button ${language === 'zh' ? 'active' : ''}`}
        onClick={() => setLanguage('zh')}
      >
        中
      </button>
    </div>
  );

  const calculateSplitBill = () => {
    const personTotals = {};
    [...Array(numberOfPeople)].forEach((_, index) => {
      const personLetter = String.fromCharCode(65 + index);
      personTotals[personLetter] = {
        total: 0,
        items: []
      };
    });

    const allItems = [...foodItems];

    allItems.forEach(item => {
      const pricePerPerson = parseFloat(item.price) / item.sharedBy.length;
      
      item.sharedBy.forEach(person => {
        personTotals[person].total += pricePerPerson;
        personTotals[person].items.push({
          name: item.name,
          amount: pricePerPerson,
          sharedWith: item.sharedBy.filter(p => p !== person).join(', ')
        });
      });
    });

    if (hasServiceCharge) {
      Object.keys(personTotals).forEach(person => {
        const serviceCharge = personTotals[person].total * 0.1;
        personTotals[person].items.push({
          name: 'Service Charge (10%)',
          amount: serviceCharge,
          sharedWith: ''
        });
        personTotals[person].total += serviceCharge;
      });
    }

    return { personTotals, allItems };
  };

  const handleConfirm = () => {
    setCurrentScreen('food');
  };

  const handlePersonToggle = (personIndex) => {
    setCurrentFood(prev => {
      const sharedBy = [...prev.sharedBy];
      const personLetter = String.fromCharCode(65 + personIndex);
      
      if (sharedBy.includes(personLetter)) {
        return {
          ...prev,
          sharedBy: sharedBy.filter(p => p !== personLetter)
        };
      } else {
        return {
          ...prev,
          sharedBy: [...sharedBy, personLetter]
        };
      }
    });
  };

  const handleNext = () => {
    if (!currentFood.price || currentFood.price <= 0) {
      alert(language === 'en' 
        ? `Please enter a valid price for ${currentFood.name}`
        : `請輸入${currentFood.name}的有效價格`);
      return;
    }
    
    if (currentFood.sharedBy.length === 0) {
      alert(language === 'en'
        ? `Please select at least one person who shared ${currentFood.name}`
        : `請選擇至少一位分享${currentFood.name}的用戶`);
      return;
    }

    setFoodItems(prev => [...prev, currentFood]);
    setCurrentFood({
      name: `${t.food} ${foodItems.length + 2}`,
      price: '',
      sharedBy: []
    });
  };

  const handleFinish = () => {
    if (!currentFood.price || currentFood.price <= 0) {
      alert(language === 'en' 
        ? `Please enter a valid price for ${currentFood.name}`
        : `請輸入${currentFood.name}的有效價格`);
      return;
    }
    
    if (currentFood.sharedBy.length === 0) {
      alert(language === 'en'
        ? `Please select at least one person who shared ${currentFood.name}`
        : `請選擇至少一位分享${currentFood.name}的用戶`);
      return;
    }

    setFoodItems(prev => [...prev, currentFood]);
    setCurrentScreen('service-charge');
  };

  const handleServiceChargeSelection = (hasCharge) => {
    setHasServiceCharge(hasCharge);
    setCurrentScreen('summary');
  };

  const handleStartOver = () => {
    setCurrentScreen('people');
    setFoodItems([]);
    setCurrentFood({
      name: `${t.food} 1`,
      price: '',
      sharedBy: []
    });
    setNumberOfPeople(2);
  };

  const handleSelectAll = () => {
    setCurrentFood(prev => {
      const allSelected = prev.sharedBy.length === numberOfPeople;
      if (allSelected) {
        // If all are selected, deselect all
        return {
          ...prev,
          sharedBy: []
        };
      } else {
        // If not all selected, select all
        return {
          ...prev,
          sharedBy: [...Array(numberOfPeople)].map((_, index) => 
            String.fromCharCode(65 + index)
          )
        };
      }
    });
  };

  if (currentScreen === 'people') {
    return (
      <div className="container">
        <ThemeToggle />
        <LanguageSelector />
        <div className="content">
          <h1 className="title">{t.title}</h1>
          <h2 className="subtitle">{t.howManyPeople}</h2>
          
          <div className="slider-container">
            <div className="number-display">{numberOfPeople}</div>
            <input
              type="range"
              className="slider"
              min={2}
              max={20}
              step={1}
              value={numberOfPeople}
              onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
            />
          </div>

          <button className="button" onClick={handleConfirm}>
            {t.continue}
          </button>
        </div>
      </div>
    );
  }

  if (currentScreen === 'service-charge') {
    return (
      <div className="container">
        <ThemeToggle />
        <div className="content">
          <h1 className="title">{t.serviceChargeTitle}</h1>
          <h2 className="subtitle">{t.hasServiceCharge}</h2>
          
          <div className="action-buttons service-charge-buttons">
            <button 
              className="button"
              onClick={() => handleServiceChargeSelection(true)}
            >
              {t.yes}
            </button>
            <button 
              className="button no-service"
              onClick={() => handleServiceChargeSelection(false)}
            >
              {t.no}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'summary') {
    const { personTotals, allItems } = calculateSplitBill();
    const totalBill = Object.values(personTotals).reduce((sum, person) => sum + person.total, 0);

    return (
      <div className="container">
        <ThemeToggle />
        <div className="content">
          <h1 className="title garp-title">Garp Money</h1>
          
          <div className="summary-container">
            <h2 className="subtitle summary-title">{t.individualTotals}</h2>
            <table className="totals-table">
              <thead>
                <tr>
                  <th>{t.person}</th>
                  <th>{t.amountToPay}</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(personTotals).map(([person, data]) => (
                  <tr key={person}>
                    <td>
                      {t.person} {person}
                      <div className="person-foods">
                        {data.items.map((item, idx) => (
                          <span key={idx} className="food-item-tag">
                            {item.name}: ${item.amount.toFixed(2)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>${data.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 className="subtitle food-list-title">{t.foodList}</h2>
            <table className="totals-table food-table">
              <thead>
                <tr>
                  <th>{t.foodItem}</th>
                  <th>{t.price}</th>
                </tr>
              </thead>
              <tbody>
                {allItems.map((item, index) => (
                  <tr key={index}>
                    <td>
                      {item.name}
                      <div className="person-foods">
                        <span className="food-item-tag">
                          {t.sharedBy}: {item.sharedBy.join(', ')}
                        </span>
                      </div>
                    </td>
                    <td>
                      ${parseFloat(item.price).toFixed(2)}
                      <div className="person-foods">
                        <span className="food-item-tag">
                          ${(parseFloat(item.price) / item.sharedBy.length).toFixed(2)} {t.perPerson}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td><strong>{t.totalBill}</strong></td>
                  <td><strong>${totalBill.toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <button className="button" onClick={handleStartOver}>
            {t.splitAnother}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <ThemeToggle />
      <div className="content">
        <h1 className="title">{currentFood.name}</h1>
        
        <div className="input-container">
          <label htmlFor="price">{t.price}</label>
          <input
            type="number"
            id="price"
            value={currentFood.price}
            onChange={(e) => setCurrentFood(prev => ({
              ...prev,
              price: e.target.value
            }))}
            placeholder={t.enterPrice}
            className="price-input"
          />
        </div>

        <div className="people-selection">
          <div className="people-selection-header">
            <h2 className="subtitle">{t.whoShared}</h2>
            <button 
              className="select-all-button"
              onClick={handleSelectAll}
            >
              {currentFood.sharedBy.length === numberOfPeople ? t.deselectAll : t.selectAll}
            </button>
          </div>
          <div className="people-buttons">
            {[...Array(numberOfPeople)].map((_, index) => {
              const personLetter = String.fromCharCode(65 + index);
              const isSelected = currentFood.sharedBy.includes(personLetter);
              return (
                <button
                  key={personLetter}
                  className={`person-button ${isSelected ? 'selected' : ''}`}
                  onClick={() => handlePersonToggle(index)}
                >
                  {personLetter}
                </button>
              );
            })}
          </div>
        </div>

        <div className="action-buttons">
          <button className="button" onClick={handleNext}>
            {t.nextFood}
          </button>
          <button className="button finish" onClick={handleFinish}>
            {t.finish}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
