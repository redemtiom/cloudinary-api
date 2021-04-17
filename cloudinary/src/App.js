import React, { useState } from 'react';
import './App.scss';
import { Upload, notification, Button, Card,Table } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
const alertTypes = [
  {
    type: 'success',
    message: 'Carga Exitosa',
    description: 'Se han cargado correctamente todas las imagenes.'
  },
  {
    type: 'error',
    message: 'Error',
    description: 'Hubo un problema al cargar el archivo'
  }
]

const App = () => {
  const [disabledButton, setDisabledButton] = useState(false)

  const openNotificationWithIcon = type => {
    notification[type](
      alertTypes.find(alertType => alertType.type == type)
    )
  }

  const props = {
    name: 'file',
    action: 'http://localhost:3000/api/cloudinary',
    accept: '.csv',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
        setDisabledButton(true)
      }
      if (info.file.status === 'done') {
        setDisabledButton(false)
        openNotificationWithIcon('success')
      } else if (info.file.status === 'error') {
        setDisabledButton(false)
        openNotificationWithIcon('error')
      }
    },
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: percent => `${parseFloat(percent.toFixed(2))}%`,
    },
  }

  const headStyle = {
    textAlign: 'center',
    fontFamily: 'Pacifico',
    fontSize: '40px'
  }

  const dataSource = [
    {
      key: '1',
      folder: 'Fragua',
      name: '7501125104770',
      url: 'https://www.movil.farmaciasguadalajara.com/wcsstore/FGCAS/wcs/products/982415_A_1280_AL.jpg'
    },
    {
      key: '2',
      folder: 'SanPablo',
      name: '7501059278547',
      url: 'https://assets2.farmaciasanpablo.com.mx/uploads-prod/productimages/Fsp480Wx480H_6270216_3_1dnsgefsa'
    },
    {
      key: '3',
      folder: 'Ahorro',
      name: '7501008496152',
      url: 'https://www.fahorro.com/media/catalog/product/cache/1/image/1280x1280/9df78eab33525d08d6e5fb8d27136e95/7/5/7501008496152_2_1.jpg'
    }
  ]

  const columns = [
    {
        title: 'Carpeta',
        dataIndex: 'folder',
        key: 'folder',
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Url',
      dataIndex: 'url',
      key: 'url',
    }
  ]

  return (
    <div className='container'>
      <div className='card-container'>
        <Card title='Cloudinary' headStyle={headStyle} bordered={true} hoverable={true}>
          <div className='card-instructions'>
            <p>
              Lea cuidadosamente las siguientes instrucciones para el
              correcto funcionamiento del programa de importación de
              imagenes externas a nuestro sitio. <br/><br/>

              El archivo debe llamarse <strong>"file.csv"</strong> y contener
              tres columnas, la primera es el nombre de la carpeta donde se
              guardara la imagen, la segunda es el nombre de con el que se guardara 
              la imagen y la tercera es la dirección url de donde se extraera la imagen.
              <br/><br/>

              Ejemplo del csv que se subira:

            </p>
          </div>
          <div className='card-table'>
            <Table 
              dataSource={dataSource} 
              columns={columns} 
              pagination={false} 
              scroll={{x:true}}
              bordered
            />
          </div>
          <div className='upload-button'>
            <Upload {...props}>
              <Button disabled={disabledButton}>
                <UploadOutlined /> Subir archivos
              </Button>
            </Upload>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default App;
