<template>
	<div class="code">
		
	</div>
</template>
<script>
export default {
	created() {
		// console.log(this.$route.query);
		this.$router.replace({ 
			path: '/test', 
			query: { 
				type: 'linkingZalo',
				data: this.$route.query
			} 
		});
	}
}
</script>