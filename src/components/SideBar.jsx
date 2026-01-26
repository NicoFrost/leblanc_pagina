// import { TurnedInNot } from '@mui/icons-material'
import { Box } from '@mui/material'
import PropTypes from 'prop-types'
import { MenuButtons } from './MenuButtons';
import { useAuthStore } from '../hooks';

export const SideBar = ({drawerWith = 240,openMenu,menus = []}) => {

  let posTop = openMenu.top;
  let posLeft = openMenu.left;

  const {user} = useAuthStore()
  if(user.role != "ADMIN_ROLE"){
    menus = menus.filter(menu => menu.id != "usuarios")
  }

  return (
    <Box
        component='nav'
        className='sideBar'
        sx={{
          bgcolor:'white',
          position: {xs:'fixed'},
          top:{xs:posTop,sm: '0px'},
          left:{xs:posLeft,sm:'0px'},
          width: {sm:drawerWith},
          flexShrink: {sm: 0},
          height:{xs:'50%',sm:"200vh"},
          borderRadius:{xs:'0px 0px 20px 0px',sm:'0px'},
          opacity:{xs:'85%',sm:'100%'},
          zIndex:5
        }}
      >
        {
          menus.map((menu) => (
            <MenuButtons key={menu.id} title={menu.title} id={menu.id}/>
          ))
        }
    </Box>
  )
}

SideBar.propTypes = {
  drawerWith: PropTypes.number,
  openMenu: PropTypes.object.isRequired,
  menus: PropTypes.array.isRequired
}