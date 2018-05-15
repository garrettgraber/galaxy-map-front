


export const SearchSystemsStyles = {
  display: 'inline-block'
};

export const SearchSystemsStylesMobile = {
  display: 'block',
  width: '100%'
};

export const SearchSystemsSelectStyles = {
  display: 'inline-block',
  width: 180,
  marginLeft: 10
};

export const SearchSystemsSelectStylesMobile = {
  display: 'block',
  width: '100%',
  marginBottom: 5
};

export const SearchButtonStyles = {
  height: 36,
  marginRight: 3,
  marginLeft: 3,
  verticalAlign: "top",
  marginLeft: 10
};

export const SearchButtonStylesMobile = {
  width: '100%',
  height: 36,
};

export const getSearchStyles = (mobileStatus) => {
  if(mobileStatus) {
    return {
      SearchContainer: SearchSystemsStylesMobile,
      SearchSelect: SearchSystemsSelectStylesMobile,
      SearchButton: SearchButtonStylesMobile
    };
  } else {
    return {
      SearchContainer: SearchSystemsStyles,
      SearchSelect: SearchSystemsSelectStyles,
      SearchButton: SearchButtonStyles
    };
  }
};