<?php

include_once 'Server.php';

class ImageServer extends Server {

        public function run() {
                parent::run();

                if ($this->_request->type === "IMAGE_GETLIST(EXTENT)") {
					if($this->_request->data->Extent !== NULL){
						$this->GetListByExtent();
					} else {
						$this->GetList();
					}
                } else if ($this->_request->type === "IMAGE_GETLIST") {
                        $this->GetList();
                } else if ($this->_request->type === "IMAGE_GETLOCATION(ID)") {
                        $this->GetLocation();
				} else if ($this->_request->type === "IMAGE_GETINFO(ID)") {
                        $this->GetInfo();
                } else if ($this->_request->type === "IMAGE_GETUPDATETABLE") {
                        $this->GetUpdateTable();
                } else if ($this->_request->type === "IMAGE_GETTAG(ID)") {
                        $this->GetTagByID();
                } else if ($this->_request->type === "IMAGE_GETTAG(NAME)") {
                        $this->GetTagByName();
                } else if ($this->_request->type === "IMAGE_GETRELATETAG(TAG)") {
                        $this->GetRelateTag();
                } else if ($this->_request->type === "IMAGE_GETTAGNUM") {
                        $this->GetTagNum();
                } else if ($this->_request->type === "IMAGE_DEVICE") {
                        $this->GetDeviceNum();
                }
        }
		
		public function GetListByExtent() {
			
			$LeftX = $this->_request->data->Extent[0];
            $BottomY = $this->_request->data->Extent[1];
            $RightX = $this->_request->data->Extent[2];
            $TopY = $this->_request->data->Extent[3];
			
			$sql = "SELECT id, geometry, ST_Contains( ST_GeomFromText('POLYGON((".
					"$LeftX $BottomY, $RightX $BottomY, $RightX $TopY, $LeftX $TopY, $LeftX $BottomY))'),geometry) ".
					"FROM public.moji_liveview ";
			
			if($this->_request->data->tag != NULL ){
				$tags = explode(" ", $this->_request->data->tag);
				$from = "FROM image_tag t0 ";
				$where = "WHERE t0.tag like '%".$tags[0]."%' ";
				for($i=1; $i<count($tags); $i++){
					$from = $from."CROSS JOIN image_tag t$i ";
					$where = $where."AND t$i.tag like '%$tags[$i]%' AND t0.id = t$i.id ";
				}
				$sub_sql = "SELECT DISTINCT t0.id ".$from.$where;
				$sql = $sql.'WHERE id in ( '.$sub_sql.' ) ';
			}
			
			if ($this->_request->data->date != NULL ){
				if($this->_request->data->tag != NULL ){
					$sql = $sql."AND to_char(DATE_TRUNC('day',create_time),'yyyy-mm-dd') = '".$this->_request->data->date."' ";
				} else {
					$sql = $sql."WHERE to_char(DATE_TRUNC('day',create_time),'yyyy-mm-dd') = '".$this->_request->data->date."' ";
				}
			}
			
			if ($this->_request->data->sort_field != NULL && $this->_request->data->sort_order != NULL ){
				$sql = $sql."ORDER BY ".$this->_request->data->sort_field." ".$this->_request->data->sort_order." ";
			}
			
			$result = @pg_query($this->_connection, 
					"SELECT id, st_astext(geometry) as geometry FROM(".$sql.") tablename "
					."WHERE tablename.ST_Contains = true");
			
			if (!$result) {
				$this->_response = array(
					"success" => false,
					"message" => pg_last_error($this->_connection)
				);
			} else {
				$result_list = array();
				$result_num = pg_num_rows($result);
				for ($i = 0;$i < $result_num ;$i++) {
					foreach (pg_fetch_row($result,$i) as $x => $x_value) {
						$result_list[$i][$x] = $x_value;
					}
				}
				$this->_response = array(
					"success" => true,
					"message" => "IMAGE_GETLIST(EXTENT)",
					"data" => $result_list,
					"num" => $result_num
				);
			}
		}
		
		public function GetLocation() {
			$result = @pg_query_params($this->_connection, 
					"SELECT id, st_astext(geometry) "
					."FROM public.moji_liveview where id=$1",
					array($this->_request->data->id));
			
			if (!$result) {
				$this->_response = array(
					"success" => false,
					"message" => pg_last_error($this->_connection)
				);
			} else {
				$result_list = array();
				foreach (pg_fetch_row($result,0) as $x => $x_value) {
					$result_list[$x] = $x_value;
				}
				$this->_response = array(
					"success" => true,
					"message" => "IMAGE_GETLOCATION(ID)",
					"data" => $result_list
				);
			}
		}
		
		public function GetInfo() {
			$keys = ["id","create_time","take_time","device","browse_num","block_name","msg","weather","location"];
			$select_keys = join(",",$keys);
			$result = @pg_query_params($this->_connection, 
					"SELECT ".$select_keys.
					" FROM public.moji_liveview where id=$1",
					array($this->_request->data->id));
			if (!$result) {
				$this->_response = array(
					"success" => false,
					"message" => pg_last_error($this->_connection)
				);
				$success = false;
			} else {
				$image_info = array();
				foreach (pg_fetch_row($result,0) as $x => $x_value) {
					$image_info[$keys[$x]] = $x_value;
				}
				$this->_response = array(
					"success" => true,
					"message" => "IMAGE_GETINFO(ID)",
					"data" => $image_info
				);
			}
		}

		public function GetList() {
			$sql = 'SELECT id, st_astext(geometry) as geometry '.
					'FROM public.moji_liveview ';
			
			if($this->_request->data->tag != NULL ){
				$tags = explode(" ", $this->_request->data->tag);
				$from = "FROM image_tag t0 ";
				$where = "WHERE t0.tag like '%".$tags[0]."%' ";
				for($i=1; $i<count($tags); $i++){
					$from = $from."CROSS JOIN image_tag t$i ";
					$where = $where."AND t$i.tag like '%$tags[$i]%' AND t0.id = t$i.id ";
				}
				$sub_sql = "SELECT DISTINCT t0.id ".$from.$where;
				$sql = $sql.'WHERE id in ( '.$sub_sql.' ) ';
			}
			
			if ($this->_request->data->date != NULL ){
				if($this->_request->data->tag != NULL ){
					$sql = $sql."AND to_char(DATE_TRUNC('day',create_time),'yyyy-mm-dd') = '".$this->_request->data->date."' ";
				} else {
					$sql = $sql."WHERE to_char(DATE_TRUNC('day',create_time),'yyyy-mm-dd') = '".$this->_request->data->date."' ";
				}
			}
			
			if ($this->_request->data->sort_field != NULL && $this->_request->data->sort_order != NULL ){
				$sql = $sql."ORDER BY ".$this->_request->data->sort_field." ".$this->_request->data->sort_order." ";
			}
			
			$result = @pg_query($this->_connection,$sql);
			if (!$result) {
				$this->_response = array(
					"success" => false,
					"message" => pg_last_error($this->_connection)
				);
			} else {
				$result_list = array();
				$result_num = pg_num_rows($result);
				for ($i = 0; $i < $result_num; $i++) {
					foreach (pg_fetch_row($result,$i) as $x => $x_value) {
						$result_list[$i][$x] = $x_value;
					}
				}
				$this->_response = array(
					"success" => true,
					"message" => "IMAGE_GETLIST",
					"data" => $result_list,
					"num" => $result_num,
					"debug" => $sql
				);
			}
		}
		
		public function GetUpdateTable() {
			$result = @pg_query($this->_connection, 
					"SELECT to_char(DATE_TRUNC('day',create_time),'yyyy-mm-dd') as time, count(*) "
					."FROM moji_liveview group by time ORDER BY time desc");
			
			if (!$result) {
				$this->_response = array(
					"success" => false,
					"message" => pg_last_error($this->_connection)
				);
			} else {
				$result_list = array();
				for ($i = 0;$i < pg_num_rows($result);$i++) {
					foreach (pg_fetch_row($result,$i) as $x => $x_value) {
						$result_list[$i][$x] = $x_value;
					}
				}
				$this->_response = array(
					"success" => true,
					"message" => "IMAGE_GETUPDATETABLE",
					"data" => $result_list
				);
			}
			
			$result = @pg_query($this->_connection, 
					'SELECT count(*) FROM public.moji_liveview');
			
			if (!$result) {
				$this->_response = array(
					"success" => false,
					"message" => pg_last_error($this->_connection)
				);
			} else if($this->_response["success"]){
					$this->_response["num"] = pg_fetch_row($result,0)[0];
			}
		}
		
		public function GetTagByID() {
			$result = @pg_query_params($this->_connection, 
					"SELECT tag "
					."FROM public.image_tag "
					."WHERE id = $1",
					array($this->_request->data->id));
			
			if (!$result) {
				$this->_response = array(
					"success" => false,
					"message" => pg_last_error($this->_connection)
				);
			} else {
				$result_list = array();
				$result_num = pg_num_rows($result);
				for ($i = 0; $i < $result_num; $i++) {
					$result_list[$i] = pg_fetch_row($result,$i)[0];
				}
				$this->_response = array(
					"success" => true,
					"message" => "IMAGE_GETTAG(ID)",
					"data" => $result_list,
					"num" => $result_num
				);
			}
		}
		
		public function GetTagByName() {
			$tags = explode(" ", $this->_request->data->tag);
			$where = "WHERE tag like '%".$tags[0]."%' ";
			for($i=1; $i<count($tags); $i++){
				$where = $where."OR tag like '%".$tags[$i]."%' ";
			}
			
			$result = @pg_query($this->_connection, 
					"SELECT tag, count(tag) "
					."FROM public.image_tag "
					.$where
					."GROUP BY tag "
					."ORDER BY count DESC");
			
			if (!$result) {
				$this->_response = array(
					"success" => false,
					"message" => pg_last_error($this->_connection)
				);
			} else {
				$result_list = array();
				$result_num = pg_num_rows($result);
				for ($i = 0; $i < $result_num; $i++) {
					foreach (pg_fetch_row($result,$i) as $x => $x_value) {
						$result_list[$i][$x] = $x_value;
					}
				}
				$this->_response = array(
					"success" => true,
					"message" => "IMAGE_GETTAG(NAME)",
					"data" => $result_list,
					"num" => $result_num
				);
			}
		}
		
		public function GetRelateTag() {
			$tags = explode(" ", $this->_request->data->tag);
			$where = "WHERE tag like '%".$tags[0]."%' ";
			for($i=1; $i<count($tags); $i++){
				$where = $where."OR tag like '%".$tags[$i]."%' ";
			}
			
			$result = @pg_query($this->_connection, 
					"SELECT tag, count(tag) 
					FROM public.image_tag 
					WHERE id in (
						SELECT id
						FROM public.image_tag ".
						$where
					.")
					GROUP BY tag
					ORDER BY count DESC
					LIMIT 10");
			
			if (!$result) {
				$this->_response = array(
					"success" => false,
					"message" => pg_last_error($this->_connection)
				);
			} else {
				$result_list = array();
				$result_num = pg_num_rows($result);
				for ($i = 0; $i < $result_num; $i++) {
					foreach (pg_fetch_row($result,$i) as $x => $x_value) {
						$result_list[$i][$x] = $x_value;
					}
				}
				$this->_response = array(
					"success" => true,
					"message" => "IMAGE_GETRELATETAG(TAG)",
					"data" => $result_list,
					"num" => $result_num
				);
			}
		}
		
		public function GetTagNum() {
			$result = @pg_query($this->_connection, 
					"SELECT tag, count(tag) 
					FROM public.image_tag 
					GROUP BY tag
					ORDER BY count DESC");
			
			if (!$result) {
				$this->_response = array(
					"success" => false,
					"message" => pg_last_error($this->_connection)
				);
			} else {
				$result_list = array();
				$result_num = pg_num_rows($result);
				for ($i = 0; $i < $result_num; $i++) {
					foreach (pg_fetch_row($result,$i) as $x => $x_value) {
						$result_list[$i][$x] = $x_value;
					}
				}
				$this->_response = array(
					"success" => true,
					"message" => "IMAGE_GETTAGNUM",
					"data" => $result_list,
					"num" => $result_num
				);
			}
		}
		
		public function GetDeviceNum() {
			$result = @pg_query($this->_connection, 
					"SELECT device, count(device) 
					FROM public.moji_liveview 
					GROUP BY device 
					ORDER BY count DESC");
			
			if (!$result) {
				$this->_response = array(
					"success" => false,
					"message" => pg_last_error($this->_connection)
				);
			} else {
				$result_list = array();
				$result_num = pg_num_rows($result);
				for ($i = 0; $i < $result_num; $i++) {
					foreach (pg_fetch_row($result,$i) as $x => $x_value) {
						$result_list[$i][$x] = $x_value;
					}
				}
				$this->_response = array(
					"success" => true,
					"message" => "IMAGE_DEVICE",
					"data" => $result_list,
					"num" => $result_num
				);
			}
		}
}

/*
多重标签查询
SELECT DISTINCT t1.id
FROM image_tag t1 CROSS JOIN image_tag t2
CROSS JOIN image_tag t3 
WHERE t1.tag like '%树%' AND t2.tag like '%街%'
AND t3.tag like '%车%'
AND t1.id = t2.id
AND t1.id = t3.id
;
*/