import PropTypes from 'prop-types'

import { ButtonBase, Divider, Typography } from '@mui/material'
import { useUIStore } from '../hooks';

export const MenuButtons = ({title,id}) => {
  
  const {SwitchMenu,activeMenu} = useUIStore()
  
  const onOptionChange = (e) => {
    if(e.target.id == "" || !(e.target.firstChild.id == undefined)){
      SwitchMenu(e.target.firstChild.id);
    } else {
      SwitchMenu(e.target.id);
    }
  }
  

  return (
    <>
      <ButtonBase
          sx={{paddingX:{xs:'10px',sm:'5px'},backgroundColor:(activeMenu == id) ? "#b6b6b6ff" : "",":first-of-type": {
           background:"#42a1ff" 
          },boxSizing:"border-box",height:"65px",width:'100%',justifyContent:'center'}}
          onClick={onOptionChange}
      > 
          <Typography id={id} sx={{paddingY:'10px'}} variant='h5' color='black'>{title}</Typography>
          {/* en este lugar iria a modificiar o eliminar ordenes de compra ya realizadas */}
      </ButtonBase>
      <Divider/>
    </>
  )
}

MenuButtons.propTypes = {
    title: PropTypes.string,
    id: PropTypes.string.isRequired
}
